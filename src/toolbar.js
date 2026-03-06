import { CONFIG, LEVELS, LEVEL_COLORS } from './config.js';
import { state } from './state.js';
import { createElement, buildTraceSearchUrl, showCopiedFeedback } from './dom.js';
import { getAllRawJsonDivs, applyFilterStateToLog, expandAll, collapseAll, rerenderVisibleLogs } from './renderer.js';
import { getParsedJson, getLevel } from './parsers.js';

function createLevelButton(level) {
    const button = createElement('button', 'tm-btn', level);
    button.style.background = LEVEL_COLORS[level];

    button.addEventListener('click', () => {
        state[level] = !state[level];
        button.classList.toggle('off', !state[level]);

        getAllRawJsonDivs().forEach(element => {
            const json = getParsedJson(element);
            if (!json) return;

            const elementLevel = getLevel(json);
            if (elementLevel !== level) return;

            applyFilterStateToLog(element, level);
        });
    });

    return button;
}

function createActionButton(label, handler) {
    const button = createElement('button', 'tm-btn', label);
    button.addEventListener('click', handler);
    return button;
}

export function createToolbar() {
    if (document.getElementById(CONFIG.toolbarId)) return;

    const toolbar = createElement('div');
    toolbar.id = CONFIG.toolbarId;

    LEVELS.forEach(level => toolbar.appendChild(createLevelButton(level)));

    toolbar.append(
        createActionButton('Expand All', expandAll),
        createActionButton('Collapse All', collapseAll),
        createActionButton('Re-scan Logs', () => rerenderVisibleLogs(true))
    );

    document.body.prepend(toolbar);
}

async function copyToClipboard(text) {
    await navigator.clipboard.writeText(text);
}

function handleTraceClick(event, traceTarget) {
    const traceId = traceTarget.dataset.traceId;
    if (!traceId) return;

    event.preventDefault();
    event.stopPropagation();
    window.open(buildTraceSearchUrl(traceId), '_blank', 'noopener,noreferrer');
}

export function setupCopyDelegation() {
    document.addEventListener('click', async event => {
        const traceTarget = event.target.closest('.tm-meta-link[data-trace-id]');
        if (traceTarget) {
            handleTraceClick(event, traceTarget);
            return;
        }

        const copyTarget = event.target.closest('.tm-meta-secondary[data-copy]');
        if (!copyTarget) return;

        try {
            await copyToClipboard(copyTarget.dataset.copy || '');
            showCopiedFeedback(copyTarget);
        } catch {}
    }, true);

    document.addEventListener('auxclick', event => {
        if (event.button !== 1) return;

        const traceTarget = event.target.closest('.tm-meta-link[data-trace-id]');
        if (!traceTarget) return;

        handleTraceClick(event, traceTarget);
    }, true);
}