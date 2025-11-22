import { TOOLBAR_ID, RAW_JSON_SELECTOR, LEVEL_COLORS } from "./config.js";
import { removeGrafanaRowAndPlaceholders } from "./remover.js";
import { scanAll } from "./scanner.js";

export const state = {
    ERROR: true,
    WARN:  true,
    INFO:  true,
    DEBUG: true
};

export function createToolbar() {
    if (document.getElementById(TOOLBAR_ID)) return;

    const bar = document.createElement("div");
    bar.id = TOOLBAR_ID;

    ["ERROR","WARN","INFO","DEBUG"].forEach(level => {
        const btn = document.createElement("button");
        btn.className = "tm-btn";
        btn.textContent = level;
        btn.style.background = LEVEL_COLORS[level];

        btn.onclick = () => {
            state[level] = !state[level];
            btn.classList.toggle("off", !state[level]);

            if (!state[level]) {
                document.querySelectorAll(RAW_JSON_SELECTOR).forEach(div => {
                    const raw = div.innerText.trim();
                    if (!raw.startsWith("{")) return;
                    try {
                        const j = JSON.parse(raw);
                        if ((j.level || "").toUpperCase() === level)
                            removeGrafanaRowAndPlaceholders(div);
                    } catch {}
                });

                document.querySelectorAll(".tm-container")
                    .forEach(c => c.dataset.level === level && c.remove());
            } else {
                scanAll(state);
            }
        };

        bar.appendChild(btn);
    });

    const exp = document.createElement("button");
    exp.className = "tm-btn";
    exp.textContent = "Expand All";
    exp.onclick = () => {
        document.querySelectorAll(".tm-details").forEach(d => d.open = true);
    };

    const col = document.createElement("button");
    col.className = "tm-btn";
    col.textContent = "Collapse All";
    col.onclick = () => {
        document.querySelectorAll(".tm-details").forEach(d => d.open = false);
    };

    bar.append(exp, col);
    document.body.prepend(bar);
}
