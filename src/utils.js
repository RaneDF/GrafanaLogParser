export function escapeHtml(s) {
    return String(s)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;');
}

export function tryParseJSON(raw) {
    try { return JSON.parse(raw); }
    catch { return null; }
}
