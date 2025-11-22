import {
    META_KEYS,
    LEVEL_COLORS
} from "./config.js";

import {
    compactJson,
    escapeHtml
} from "./utils.js";

import {
    removeGrafanaRow
} from "./remover.js";

import {
    state
} from "./scanner.js";

/**
 * Main formatting function applied to each raw Grafana JSON log block.
 */
export function formatJsonDiv(div) {
    if (!div || div.classList.contains("tm-done")) return;

    const raw = (div.innerText || "").trim();
    if (!raw.startsWith("{")) return;

    let json;
    try {
        json = JSON.parse(raw);
    } catch {
        return;
    }

    const level = String(json.level || "INFO").toUpperCase();

    // filtering based on active toolbar state
    if (!state[level]) {
        removeGrafanaRow(div);
        return;
    }

    // Create main container
    const container = document.createElement("div");
    container.className = `tm-container tm-sev-${level}`;
    container.dataset.level = level;

    // ---------------------
    // METADATA HEADER
    // ---------------------
    const meta = document.createElement("div");
    meta.className = "tm-meta-line";

    // timestamp first
    if (json.timestamp) {
        const ts = document.createElement("div");
        ts.className = "tm-meta-ts";
        ts.textContent = json.timestamp;
        meta.appendChild(ts);
    }

    // level badge
    const lvlBadge = document.createElement("div");
    lvlBadge.className = "tm-meta-level";
    lvlBadge.textContent = level;
    lvlBadge.style.background = LEVEL_COLORS[level] || "#666";
    meta.appendChild(lvlBadge);

    // small metadata items with click-to-copy
    function addMeta(label, value) {
        if (!value) return;
        const el = document.createElement("div");
        el.className = "tm-meta-secondary";
        el.textContent = `${label}:${value}`;
        el.title = value;

        el.onclick = async () => {
            try {
                await navigator.clipboard.writeText(String(value));
                const old = el.textContent;
                el.textContent = `${label}:${value} ✓`;
                setTimeout(() => (el.textContent = old), 600);
            } catch {}
        };

        meta.appendChild(el);
    }

    addMeta("trace", json.traceId);
    addMeta("span", json.spanId);
    addMeta("logger", json.logger_name);
    addMeta("thread", json.thread_name);

    container.appendChild(meta);

    // ---------------------
    // COMPACT JSON (OPTIONAL)
    // ---------------------
    const compact = compactJson(json);
    if (compact) {
        const pre = document.createElement("pre");
        pre.className = "tm-block";
        pre.textContent = compact;
        container.appendChild(pre);
    }

    // ---------------------
    // MESSAGE BLOCK
    // ---------------------
    if (json.message !== undefined) {
        const msg = document.createElement("pre");
        msg.className = "tm-block";

        // try nested JSON inside message
        try {
            const nested = JSON.parse(json.message);
            msg.textContent = JSON.stringify(nested, null, 2);
        } catch {
            msg.textContent = String(json.message);
        }

        container.appendChild(msg);
    }

    // ---------------------
    // STACK TRACE BLOCK
    // ---------------------
    if (json.stack_trace) {
        const details = document.createElement("details");
        details.className = "tm-details";

        const summary = document.createElement("summary");
        summary.textContent = "Stack Trace";
        details.appendChild(summary);

        const st = document.createElement("pre");
        st.className = "tm-block";
        st.textContent = json.stack_trace
            .replace(/\\n/g, "\n")
            .replace(/\\r/g, "\r");

        details.appendChild(st);
        container.appendChild(details);
    }

    // ---------------------
    // COPY JSON BUTTON
    // ---------------------
    const copyBtn = document.createElement("button");
    copyBtn.className = "tm-copy-btn";
    copyBtn.textContent = "Copy JSON";

    copyBtn.onclick = async () => {
        const filtered = {};
        Object.keys(json).forEach((k) => {
            if (!META_KEYS.includes(k)) filtered[k] = json[k];
        });

        try {
            await navigator.clipboard.writeText(
                JSON.stringify(filtered, null, 2)
            );
            copyBtn.textContent = "Copied ✓";
            setTimeout(() => (copyBtn.textContent = "Copy JSON"), 800);
        } catch {
            copyBtn.textContent = "Error";
            setTimeout(() => (copyBtn.textContent = "Copy JSON"), 800);
        }
    };

    container.appendChild(copyBtn);

    // ---------------------
    // REPLACE RAW GRAFANA LOG ROW
    // ---------------------
    try {
        // hide grafana raw
        div.style.display = "none";

        // remove previous formatting, if any
        if (
            div.nextSibling &&
            div.nextSibling.classList &&
            div.nextSibling.classList.contains("tm-container")
        ) {
            div.nextSibling.remove();
        }

        // insert our formatted container
        div.parentNode.insertBefore(container, div.nextSibling);
        div.classList.add("tm-done");
    } catch (e) {
        console.warn("Formatter insert failed:", e);
    }
}
