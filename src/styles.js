import { CONFIG } from './config.js';

export function injectStyles() {
    if (document.getElementById(CONFIG.styleId)) return;

    const css = `
.tm-container{
    margin:4px 0;
    border-left:4px solid transparent;
    padding:6px 8px;
    border-radius:6px;
    background:rgba(255,255,255,0.02)
}
.tm-sev-ERROR{border-left-color:#E53935;background:rgba(229,57,53,0.06)}
.tm-sev-WARN{border-left-color:#FF9800;background:rgba(255,152,0,0.05)}
.tm-sev-INFO{border-left-color:#43A047;background:rgba(67,160,71,0.04)}
.tm-sev-DEBUG{border-left-color:#42A5F5;background:rgba(66,165,245,0.03)}

.tm-meta-line{
    display:flex;
    gap:8px;
    align-items:center;
    font-size:11px;
    color:#bfc8d0;
    margin-bottom:4px;
    flex-wrap:wrap;
    line-height:1.2
}
.tm-meta-ts{
    color:#fff;
    font-weight:700
}
.tm-meta-level{
    font-weight:700;
    padding:1px 6px;
    border-radius:4px;
    color:white;
    line-height:1.1
}
.tm-meta-secondary{
    color:#94a2ad;
    font-size:11px;
    cursor:pointer;
    user-select:none;
    line-height:1.15
}
.tm-meta-secondary:hover{
    color:#dfe8f2;
    text-decoration:underline
}
.tm-meta-link{
    color:#7ec3ff;
    font-size:11px;
    cursor:pointer;
    user-select:none;
    line-height:1.15
}
.tm-meta-link:hover{
    color:#c9e7ff;
    text-decoration:underline
}

.tm-block{
    background:#131619;
    color:#e7eef3;
    padding:4px 6px;
    border-radius:6px;
    font-family:ui-monospace,Menlo,monospace;
    font-size:11px;
    line-height:1.15;
    white-space:pre-wrap;
    word-break:break-word;
    margin:2px 0 0 0 !important;
    box-shadow:none;
}

.tm-details{
    margin-top:4px
}
.tm-details summary{
    cursor:pointer;
    font-weight:600;
    color:#cce1ff;
    font-size:12px;
    margin:0
}

#${CONFIG.toolbarId}{
    position:sticky;
    top:6px;
    background:rgba(20,20,20,0.92);
    padding:6px;
    border-radius:8px;
    z-index:99999;
    display:flex;
    gap:6px;
    border:1px solid rgba(255,255,255,0.05);
    margin-bottom:6px;
    flex-wrap:wrap
}

.tm-btn{
    border-radius:6px;
    padding:4px 8px;
    font-size:11px;
    font-weight:600;
    cursor:pointer;
    border:1px solid rgba(255,255,255,0.08);
    color:#fff
}
.tm-btn.off{
    background:#555 !important;
    color:#ddd;
    opacity:.6
}
`;

    const style = document.createElement('style');
    style.id = CONFIG.styleId;
    style.textContent = css;
    document.head.appendChild(style);
}