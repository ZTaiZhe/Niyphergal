const ALLOWED_TAGS = new Set(['div', 'span', 'p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'img', 'a', 'table', 'tbody', 'tr', 'td', 'th']);
const ALLOWED_ATTRS = new Set(['href', 'src', 'class', 'id', 'alt', 'title', 'data-hero-id', 'style']);

export function strictSanitize(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);

    const nodesToModify = [];
    let currentNode = walker.currentNode;

    while (currentNode) {
        if (currentNode !== doc.body) {
            nodesToModify.push(currentNode);
        }
        currentNode = walker.nextNode();
    }

    for (let i = nodesToModify.length - 1; i >= 0; i--) {
        const el = nodesToModify[i];
        const tagName = el.tagName.toLowerCase();

        if (!ALLOWED_TAGS.has(tagName)) {
            while (el.firstChild) {
                el.parentNode.insertBefore(el.firstChild, el);
            }
            el.parentNode.removeChild(el);
            continue;
        }

        const attrs = Array.from(el.attributes);
        for (const attr of attrs) {
            if (!ALLOWED_ATTRS.has(attr.name)) {
                el.removeAttribute(attr.name);
                continue;
            }

            if (attr.name === 'href' || attr.name === 'src') {
                const val = attr.value.trim().toLowerCase();
                if (val.startsWith('javascript:') || val.startsWith('data:text/html')) {
                    el.setAttribute(attr.name, '#');
                }
            }
        }
    }

    return doc.body.innerHTML;
}
