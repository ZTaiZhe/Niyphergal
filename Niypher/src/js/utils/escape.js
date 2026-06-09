export function escapeHTMLAttribute(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (match) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;'
        };
        return map[match];
    });
}

export function validateSafeURL(url) {
    try {
        const parsed = new URL(url, window.location.origin);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return 'about:blank';
        }
        return parsed.href;
    } catch (e) {
        return '#';
    }
}
