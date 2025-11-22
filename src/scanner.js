import {
    RAW_JSON_SELECTOR,
    META_KEYS,
    LEVEL_COLORS
} from "./config.js";

import { removeGrafanaRowAndPlaceholders } from "./remover.js";
import { tryParseJSON } from "./utils.js";

export function buildCompactJSON(obj) {
    const out = {};
    for (const k of Object.keys(obj)) {
        if (!META_KEYS.includes(k)) out[k] = obj[k];
    }

    const keys = Object.keys(out);
    if (keys.length === 0) return null;
    if (keys.every(k => k === "message" || k === "stack_trace")) return null;

    return JSON.stringify(out, null, 2);
}

export function formatJsonDiv(div, state) {
    if (!div || div.classList.contains("tm-done")) return;

    const raw = div.innerText.trim();
    if (!raw.startsWith("{")) return;

    const json = tryParseJSON(raw);
    if (!json) return;

    const level = String(json.level || "INFO").toUpperCase();

    if (!state[level]) {
        removeGrafanaRowAndPlaceholders(div);
        return;
    }

    const wrap = document.createElement("div");
    wrap.className = `tm-container tm-sev-${level}`;
    wrap.dataset.level = level;

    const meta = document.createElement("div");
    meta.className = "tm-meta-line";

    if (json.timestamp) {
        const ts = document.createElement("div");
        ts.className = "tm-meta-ts";
        ts.textContent = json.timestamp;
        meta.appendChild(ts);
    }

    const lvl = document.createElement("div");
    lvl.className = "tm-meta-level";
    lvl.textContent = level;
    lvl.style.background = LEVEL_COLORS[level] || "#777";
    wrap.appendChild(meta);
    meta.appendChild(lvl);

    function addMeta(k, v) {
        const el = document.createElement("div");
        el.className = "tm-meta-secondary";
        el.textContent = `${k}:${v}`;
        el.addEventListener("click", () =>
            navigator.clipboard.writeText(String(v))
        );
        meta.appendChild(el);
    }

    if (json.traceId) addMeta("trace", json.traceId);
    if (json.spanId) addMeta("span", json.spanId);
    if (json.logger_name) addMeta("logger", json.logger_name);
    if (json.thread_name) addMeta("thread", json.thread_name);

    const compact = buildCompactJSON(json);
    if (compact) {
        const pre = document.createElement("pre");
        pre.className = "tm-block";
        pre.textContent = compact;
        wrap.appendChild(pre);
    }

    if (json.message !== undefined) {
        const pre = document.createElement("pre");
        pre.className = "tm-block";
        pre.textContent = json.message;
        wrap.appendChild(pre);
    }

    if (json.stack_trace) {
        const det = document.createElement("details");
        det.className = "tm-details";
        const s = document.createElement("summary");
        s.textContent = "Stack Trace";
        const body = document.createElement("pre");
        body.className = "tm-block";
        body.textContent = json.stack_trace.replace(/\\n/g, "\n");
        det.append(s, body);
        wrap.appendChild(det);
    }

    div.style.display = "none";
    if (div.nextSibling?.classList?.contains("tm-container"))
        div.nextSibling.remove();

    div.after(wrap);
    div.classList.add("tm-done");
}

export function scanAll(state) {
    document.querySelectorAll(RAW_JSON_SELECTOR)
        .forEach(div => formatJsonDiv(div, state));
}
