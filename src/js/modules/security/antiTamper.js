export function lockRuntimePrototypes() {
    if (!window.__NPHER_V2 || !window.__NPHER_V2.antiTamper) {
        return;
    }

    Object.deepFreeze = (obj) => {
        Object.keys(obj).forEach(prop => {
            if (typeof obj[prop] === 'object' && obj[prop] !== null) {
                Object.deepFreeze(obj[prop]);
            }
        });
        return Object.freeze(obj);
    };

    if (window.__NPHER_V2) {
        Object.deepFreeze(window.__NPHER_V2);
    }

    const isNative = (fn) => typeof fn === 'function' && /\{\s*\[native code\]\s*\}/.test(fn.toString());

    const fetchNative = isNative(window.fetch);
    const jsonNative = isNative(JSON.parse);
    const xpathNative = isNative(Document.prototype.evaluate);

    if (!fetchNative || !jsonNative || !xpathNative) {
        const nativePattern = /\{\s*\[native code\]\s*\}/;
        const testSucc = nativePattern.test(String.bind(null, ''));
        if (!testSucc) {
            console.warn('[NiypherGal] [native code] detection unavailable on this browser, skipping anti-tamper check.');
            return;
        }

        if (window.Telemetry) {
            window.Telemetry.track('runtime_compromised', {
                fetchNative,
                xpathNative
            });
        }
        window.__NPHER_V2_TAMPERED = true;
    }
}
