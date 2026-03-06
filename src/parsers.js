import { META_KEYS, STACK_KEYS } from './config.js';
import { parsedCache } from './state.js';

export function getRawText(element) {
    return (element?.textContent || '').trim();
}

export function isLikelyJson(raw) {
    return !!raw && (raw[0] === '{' || raw[0] === '[');
}

export function getParsedJson(element) {
    if (!element) return null;

    const raw = getRawText(element);
    const cached = parsedCache.get(element);

    if (cached && cached.raw === raw) {
        return cached.parsed;
    }

    if (!isLikelyJson(raw)) {
        parsedCache.set(element, { raw, parsed: null });
        return null;
    }

    try {
        const parsed = JSON.parse(raw);
        parsedCache.set(element, { raw, parsed });
        return parsed;
    } catch {
        parsedCache.set(element, { raw, parsed: null });
        return null;
    }
}

export function getLevel(json) {
    return String(json?.level || 'INFO').toUpperCase();
}

export function getStackValue(json) {
    for (const key of STACK_KEYS) {
        if (json[key]) return json[key];
    }
    return null;
}

export function removeMetaKeys(json) {
    const result = {};
    for (const key of Object.keys(json)) {
        if (!META_KEYS.includes(key)) {
            result[key] = json[key];
        }
    }
    return result;
}

export function shouldRenderCompactJson(json) {
    const keys = Object.keys(json);
    if (keys.length === 0) return false;

    return !keys.every(key =>
        key === 'message' ||
        key === 'stack_trace' ||
        key === 'stackTrace' ||
        key === 'stacktrace'
    );
}

export function buildCompactJson(json) {
    const compact = removeMetaKeys(json);
    if (!shouldRenderCompactJson(compact)) return null;

    try {
        return JSON.stringify(compact, null, 2);
    } catch {
        return null;
    }
}

export function findEmbeddedJsonStartInMessage(message) {
    if (!message) return -1;

    for (let i = 0; i < message.length; i++) {
        const ch = message[i];
        if (ch !== '{' && ch !== '[') continue;

        const candidate = message.slice(i).trim();
        if (!candidate) continue;

        try {
            JSON.parse(candidate);
            return i;
        } catch {}
    }

    return -1;
}

export function splitMessageAndEmbeddedJson(message) {
    if (typeof message !== 'string' || !message) return null;

    const start = findEmbeddedJsonStartInMessage(message);
    if (start < 0) return null;

    const text = message.slice(0, start).trimEnd();
    const jsonPart = message.slice(start).trim();

    if (!jsonPart) return null;

    try {
        const parsed = JSON.parse(jsonPart);
        if (!parsed || typeof parsed !== 'object') return null;

        return {
            text,
            json: parsed
        };
    } catch {
        return null;
    }
}

export function findJavaObjectStart(message) {
    if (!message) return -1;

    const patterns = [
        /\b[A-Z][A-Za-z0-9_]*\(/,
        /\b\w+\(/
    ];

    for (const pattern of patterns) {
        const match = pattern.exec(message);
        if (match) return match.index;
    }

    return -1;
}

export function splitMessageAndJavaObject(message) {
    if (typeof message !== 'string' || !message) return null;

    const start = findJavaObjectStart(message);
    if (start < 0) return null;

    const text = message.slice(0, start).trimEnd();
    const objectText = message.slice(start).trim();

    if (!objectText.includes('(') || !objectText.includes(')')) return null;

    return {
        text,
        objectText
    };
}

export function prettyFormatJavaObject(input) {
    if (!input) return '';

    let out = '';
    let indent = 0;
    let inString = false;
    let quoteChar = '';
    const indentUnit = '  ';

    function newline(extra = 0) {
        out += '\n' + indentUnit.repeat(Math.max(0, indent + extra));
    }

    for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        const prev = i > 0 ? input[i - 1] : '';

        if (inString) {
            out += ch;
            if (ch === quoteChar && prev !== '\\') {
                inString = false;
                quoteChar = '';
            }
            continue;
        }

        if (ch === '"' || ch === "'") {
            inString = true;
            quoteChar = ch;
            out += ch;
            continue;
        }

        if (ch === '(' || ch === '[' || ch === '{') {
            out += ch;
            indent++;
            newline();
            continue;
        }

        if (ch === ')' || ch === ']' || ch === '}') {
            indent--;
            newline();
            out += ch;
            continue;
        }

        if (ch === ',') {
            out += ch;
            newline();
            continue;
        }

        out += ch;
    }

    return out
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}