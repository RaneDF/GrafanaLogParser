import { TOOLBAR_ID } from "./config.js";

export function injectStyles() {
    if (document.getElementById("tm-vic-style")) return;

    const CSS = `
    .tm-container{margin:10px 0;border-left:6px solid transparent;padding:12px;border-radius:8px;background:rgba(255,255,255,0.02)}
    .tm-sev-ERROR{border-left-color:#E53935;background:rgba(229,57,53,0.06)}
    .tm-sev-WARN{border-left-color:#FF9800;background:rgba(255,152,0,0.05)}
    .tm-sev-INFO{border-left-color:#43A047;background:rgba(67,160,71,0.04)}
    .tm-sev-DEBUG{border-left-color:#42A5F5;background:rgba(66,165,245,0.03)}

    .tm-meta-line{display:flex;gap:12px;align-items:center;font-size:13px;color:#bfc8d0;margin-bottom:8px;flex-wrap:wrap}
    .tm-meta-ts{color:#fff;font-weight:700}
    .tm-meta-level{font-weight:700;padding:2px 8px;border-radius:6px;color:white}
    .tm-meta-secondary{color:#94a2ad;font-size:12px;cursor:pointer}

    .tm-block{background:#131619;color:#e7eef3;padding:12px;border-radius:8px;
              font-family:ui-monospace,Menlo,monospace;font-size:13px;line-height:1.42;
              white-space:pre-wrap;margin-top:8px;
              box-shadow: inset 0 0 10px rgba(120,180,255,0.06)}

    .tm-details summary{cursor:pointer;font-weight:600;color:#cce1ff}

    #${TOOLBAR_ID}{
        position:sticky;top:6px;background:rgba(20,20,20,0.92);
        padding:8px;border-radius:8px;z-index:99999;
        display:flex;gap:8px;border:1px solid rgba(255,255,255,0.05)
    }
    .tm-btn{
        border-radius:6px;padding:6px 10px;font-size:12px;font-weight:600;
        cursor:pointer;border:1px solid rgba(255,255,255,0.08)
    }
    .tm-btn.off{background:#555;color:#ddd;opacity:.6}

    .tm-copy-btn{
        float:right;margin-top:6px;padding:6px 10px;font-size:12px;border-radius:6px;
        background:#202325;color:#dfe6ee;border:1px solid rgba(255,255,255,0.05);
        cursor:pointer
    }
    `;

    const el = document.createElement("style");
    el.id = "tm-vic-style";
    el.textContent = CSS;
    document.head.appendChild(el);
}
