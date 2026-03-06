import { CONFIG } from './config.js';
import { runtime } from './state.js';
import { enqueueNode, rerenderVisibleLogs } from './renderer.js';

function collectJsonDivsFromNode(node, output) {
    if (!node || node.nodeType !== 1) return;

    if (node.matches?.(CONFIG.rawJsonSelector)) {
        output.push(node);
    }

    const nested = node.querySelectorAll?.(CONFIG.rawJsonSelector);
    if (!nested?.length) return;

    for (const element of nested) {
        output.push(element);
    }
}

export function setupObserver() {
    runtime.observer?.disconnect();

    runtime.observer = new MutationObserver(mutations => {
        const found = [];

        for (const mutation of mutations) {
            if (mutation.type !== 'childList' || !mutation.addedNodes?.length) continue;
            mutation.addedNodes.forEach(node => collectJsonDivsFromNode(node, found));
        }

        if (!found.length) return;
        found.forEach(enqueueNode);
    });

    runtime.observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

export function setupRefreshClickHook() {
    document.addEventListener('click', () => {
        clearTimeout(runtime.refreshTimer);
        runtime.refreshTimer = setTimeout(() => rerenderVisibleLogs(false), 700);
    }, true);
}