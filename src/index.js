import { injectStyles } from "./styles.js";
import { createToolbar, state } from "./toolbar.js";
import { scanAll } from "./scanner.js";

(function() {
    injectStyles();
    createToolbar();
    scanAll(state);

    const obs = new MutationObserver(() => scanAll(state));
    obs.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
