import {
    DETAILS_SELECTOR,
    PLACEHOLDER_MIN_HEIGHT,
    ROW_CLASS_TOKEN
} from "./config.js";

export function removeGrafanaRowAndPlaceholders(jsonDiv) {
    if (!jsonDiv) return;

    let tr = jsonDiv.closest("tr");

    if (tr && !String(tr.className).includes(ROW_CLASS_TOKEN)) {
        let node = jsonDiv.parentElement;
        while (node && node !== document.body) {
            if (
                node.tagName === "TR" &&
                String(node.className).includes(ROW_CLASS_TOKEN)
            ) {
                tr = node;
                break;
            }
            node = node.parentElement;
        }
    }

    if (!tr) {
        let node = jsonDiv.parentElement;
        while (node && node !== document.body) {
            if (/row/.test(String(node.className))) {
                tr = node;
                break;
            }
            node = node.parentElement;
        }
    }

    if (tr && tr.parentNode) {
        let next = tr.nextElementSibling;
        tr.remove();

        while (next) {
            const nxt = next.nextElementSibling;

            if (next.matches?.(DETAILS_SELECTOR)) {
                next.remove();
                next = nxt;
                continue;
            }

            if (next.querySelector?.(DETAILS_SELECTOR)) {
                next.remove();
                next = nxt;
                continue;
            }

            const text = (next.textContent || "").trim();
            const hasUI = next.querySelector?.("button,svg");
            const height = next.getBoundingClientRect?.().height || 9999;

            if (!text && !hasUI && height <= PLACEHOLDER_MIN_HEIGHT) {
                next.remove();
                next = nxt;
                continue;
            }

            break;
        }
        return;
    }

    try {
        const w = jsonDiv.parentElement?.parentElement;
        if (w) {
            const n = w.nextElementSibling;
            w.remove();
            if (n && n.matches?.(DETAILS_SELECTOR)) n.remove();
        }
    } catch {}
}
