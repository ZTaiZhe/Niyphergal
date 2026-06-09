import { CONFIG } from './config.js';
import telemetry from './telemetry.js';

const ON_EVENT_ATTRS = [
    'onload', 'onerror', 'onclick', 'onfocus', 'onblur', 'onchange',
    'onsubmit', 'onreset', 'onselect', 'onkeydown', 'onkeypress', 'onkeyup',
    'onmouseover', 'onmouseout', 'onmousedown', 'onmouseup', 'onmousemove',
    'ondblclick', 'oncontextmenu', 'onwheel', 'onscroll', 'onresize',
    'onabort', 'oncanplay', 'oncanplaythrough', 'ondurationchange',
    'onemptied', 'onended'
];

const DEFAULT_TIMEOUT_MS = 5000;

export class ScrapeRule {
    constructor({ linkPath, itemTitle, itemCover, itemPrice, itemDeveloper, itemDate }) {
        this.linkPath = Array.isArray(linkPath) ? linkPath : (linkPath ? [linkPath] : []);
        this.itemTitle = Array.isArray(itemTitle) ? itemTitle : (itemTitle ? [itemTitle] : []);
        this.itemCover = Array.isArray(itemCover) ? itemCover : (itemCover ? [itemCover] : []);
        this.itemPrice = Array.isArray(itemPrice) ? itemPrice : (itemPrice ? [itemPrice] : []);
        this.itemDeveloper = Array.isArray(itemDeveloper) ? itemDeveloper : (itemDeveloper ? [itemDeveloper] : []);
        this.itemDate = Array.isArray(itemDate) ? itemDate : (itemDate ? [itemDate] : []);
    }
}

function sanitizeDocument(doc) {
    doc.querySelectorAll('*').forEach(el => {
        ON_EVENT_ATTRS.forEach(attr => el.removeAttribute(attr));
    });
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && ON_EVENT_ATTRS.includes(mutation.attributeName)) {
                mutation.target.removeAttribute(mutation.attributeName);
            }
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        ON_EVENT_ATTRS.forEach(attr => node.removeAttribute?.(attr));
                    }
                });
            }
        });
    });
    observer.observe(doc.documentElement, { childList: true, subtree: true, attributes: true });
    return doc;
}

export function evaluateFirstMatch(xpaths, doc, contextNode) {
    if (!xpaths || xpaths.length === 0) {
        return { nodeValue: null, xpathIndex: -1, matchedPath: null };
    }

    for (let i = 0; i < xpaths.length; i++) {
        try {
            const result = doc.evaluate(
                xpaths[i],
                contextNode || doc,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            );
            const node = result.singleNodeValue;
            if (node) {
                return {
                    nodeValue: node.nodeValue || node.textContent || node.href || node.src || null,
                    xpathIndex: i,
                    matchedPath: xpaths[i],
                    node
                };
            }
        } catch (e) {
            continue;
        }
    }

    return { nodeValue: null, xpathIndex: -1, matchedPath: null };
}

export function evaluateAllMatches(xpaths, doc, contextNode) {
    if (!xpaths || xpaths.length === 0) {
        return { nodes: [], xpathIndex: -1, matchedPath: null };
    }

    for (let i = 0; i < xpaths.length; i++) {
        try {
            const snapshot = doc.evaluate(
                xpaths[i],
                contextNode || doc,
                null,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null
            );
            const nodes = [];
            for (let j = 0; j < snapshot.snapshotLength; j++) {
                const node = snapshot.snapshotItem(j);
                nodes.push({
                    nodeValue: node.nodeValue || node.textContent || node.href || node.src || null,
                    node
                });
            }
            if (nodes.length > 0) {
                return { nodes, xpathIndex: i, matchedPath: xpaths[i] };
            }
        } catch (e) {
            continue;
        }
    }

    return { nodes: [], xpathIndex: -1, matchedPath: null };
}

export async function scrapeWithTimeout(url, { timeoutMs, rule, fetchOptions }) {
    var t0 = Date.now();
    const timeout = timeoutMs || DEFAULT_TIMEOUT_MS;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
            headers: {
                'Accept': 'text/html,application/xhtml+xml',
                ...(fetchOptions?.headers || {})
            }
        });

        clearTimeout(timer);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        sanitizeDocument(doc);

        const result = {};

        if (rule) {
            const linkResult = evaluateFirstMatch(rule.linkPath, doc);
            result.purchaseLink = linkResult.nodeValue;
            result.linkMatchedPath = linkResult.matchedPath;

            const titleResult = evaluateFirstMatch(rule.itemTitle, doc);
            result.title = titleResult.nodeValue;
            result.titleMatchedPath = titleResult.matchedPath;

            const coverResult = evaluateFirstMatch(rule.itemCover, doc);
            result.cover = coverResult.nodeValue;
            result.coverMatchedPath = coverResult.matchedPath;

            const priceResult = evaluateFirstMatch(rule.itemPrice, doc);
            result.price = priceResult.nodeValue;
            result.priceMatchedPath = priceResult.matchedPath;

            const devResult = evaluateFirstMatch(rule.itemDeveloper, doc);
            result.developer = devResult.nodeValue;

            const dateResult = evaluateFirstMatch(rule.itemDate, doc);
            result.releaseDate = dateResult.nodeValue;

            const allFallback = !result.purchaseLink && !result.title;
            if (allFallback && telemetry) {
                telemetry.track({
                    type: 'scraper_fallback',
                    name: 'scraper_fallback',
                    data: {
                        url,
                        domain: new URL(url).hostname,
                        reason: 'xpath_mismatch',
                        failedPaths: rule.linkPath.filter((_, i) => {
                            const r = evaluateFirstMatch([rule.linkPath[i]], doc);
                            return r.xpathIndex === -1;
                        }),
                        timestamp: Date.now()
                    }
                });
            }
        }

        return {
            status: 'success',
            data: result,
            latencyMs: Date.now() - t0
        };

    } catch (err) {
        clearTimeout(timer);

        if (err.name === 'AbortError') {
            if (telemetry) {
                telemetry.track({
                    type: 'scraper_timeout',
                    name: 'scraper_timeout',
                    data: { url, timeout, timestamp: Date.now() }
                });
            }
            return { status: 'timeout', data: null };
        }

        if (telemetry) {
            telemetry.track({
                type: 'scraper_error',
                name: 'scraper_error',
                data: { url, error: err.message, timestamp: Date.now() }
            });
        }

        return { status: 'error', data: null, error: err.message };
    }
}

export function createDomainRule(domain) {
    const rules = {
        'dlsoft.dmm.co.jp': new ScrapeRule({
            linkPath: [
                '//a[contains(@class, "btn-purchase")]/@href',
                '//a[contains(@href, "/cart")]/@href',
                '//div[contains(@class, "buy-area")]//a/@href'
            ],
            itemTitle: [
                '//h1[contains(@class, "product-title")]/text()',
                '//meta[@property="og:title"]/@content'
            ],
            itemCover: [
                '//img[contains(@class, "product-image")]/@src',
                '//meta[@property="og:image"]/@content'
            ],
            itemPrice: [
                '//span[contains(@class, "price")]/text()',
                '//div[contains(@class, "price-area")]//text()'
            ]
        }),
        'www.dlsite.com': new ScrapeRule({
            linkPath: [
                '//a[contains(@class, "btn_cart")]/@href',
                '//form[@id="BuyAtShopForm"]/@action',
                '//a[contains(@href, "/work/=/product_id")]/@href'
            ],
            itemTitle: [
                '//h1[@id="work_name"]/text()',
                '//meta[@property="og:title"]/@content'
            ],
            itemCover: [
                '//meta[@property="og:image"]/@content',
                '//div[@id="work_img"]//img/@src'
            ],
            itemPrice: [
                '//span[@class="work_price"]/text()',
                '//span[@id="work_price"]/text()'
            ]
        }),
        'store.steampowered.com': new ScrapeRule({
            linkPath: [
                '//a[contains(@class, "game_purchase_action")]/@href',
                '//div[contains(@class, "game_purchase_price")]//@href',
                '//a[contains(@href, "/checkout/")]/@href'
            ],
            itemTitle: [
                '//div[@id="appHubAppName"]/text()',
                '//meta[@property="og:title"]/@content'
            ],
            itemCover: [
                '//meta[@property="og:image"]/@content',
                '//img[contains(@class, "game_header_image")]/@src'
            ],
            itemPrice: [
                '//div[contains(@class, "game_purchase_price")]/text()',
                '//div[contains(@class, "discount_final_price")]/text()'
            ]
        })
    };

    for (const [key, rule] of Object.entries(rules)) {
        if (domain.includes(key)) {
            return rule;
        }
    }

    return new ScrapeRule({
        linkPath: [
            '//a[contains(@class, "btn-purchase")]/@href',
            '//a[contains(@class, "buy")]/@href',
            '//a[contains(@href, "/cart")]/@href',
            '//a[@id="purchase-btn"]/@href',
            '//a[contains(@class, "purchase-btn")]/@href'
        ],
        itemTitle: [
            '//meta[@property="og:title"]/@content',
            '//h1/text()'
        ],
        itemCover: [
            '//meta[@property="og:image"]/@content'
        ]
    });
}

const ALLOWED_ORIGINS = new Set([
    'dlsoft.dmm.co.jp',
    'www.dlsite.com',
    'store.steampowered.com',
    'www.getchu.com'
]);

export function isAllowedOrigin(url) {
    try {
        const hostname = new URL(url).hostname;
        return ALLOWED_ORIGINS.has(hostname) ||
            Array.from(ALLOWED_ORIGINS).some(o => hostname.endsWith(o));
    } catch {
        return false;
    }
}

export { ALLOWED_ORIGINS };
