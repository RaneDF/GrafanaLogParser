import { LEVEL_COLORS } from './config.js';
import { state, renderedRawCache, queuedNodes, runtime, parsedCache } from './state.js';
import {
    createElement,
    createPreBlock,
    createMetaItem,
    createTraceItem,
    getRenderedContainer,
    removeRenderedContainerNear,
    markHidden,
    unmarkHidden,
    hideLog,
    showLog
} from './dom.js';
import {
    getRawText,
    getParsedJson,
    getLevel,
    getStackValue,
    buildCompactJson,
    splitMessageAndEmbeddedJson,
    splitMessageAndJavaObject,
    prettyFormatJavaObject
} from './parsers.js';
import { CONFIG } from './config.js';

function appendMetaLine(container, json, level) {
    const meta = createElement('div', 'tm-meta-line');

    if (json.timestamp) {
        meta.appendChild(createElement('div', 'tm-meta-ts', String(json.timestamp)));
    }

    const levelBadge = createElement('div', 'tm-meta-level', level);
    levelBadge.style.background = LEVEL_COLORS[level] || '#777';
    meta.appendChild(levelBadge);

    if (json.traceId) meta.appendChild(createTraceItem(json.traceId));
    if (json.spanId) meta.appendChild(createMetaItem('span', json.spanId));
    if (json.logger_name) meta.appendChild(createMetaItem('logger', json.logger_name));
    if (json.thread_name) meta.appendChild(createMetaItem('thread', json.thread_name));

    container.appendChild(meta);
}

function appendCompactJson(container, json) {
    const compact = buildCompactJson(json);
    if (compact) {
        container.appendChild(createPreBlock(compact));
    }
}

function appendMessage(container, json) {
    if (json.message === undefined || json.message === null || json.message === '') {
        return;
    }

    const message = String(json.message);

    const embedded = splitMessageAndEmbeddedJson(message);
    if (embedded) {
        if (embedded.text) {
            container.appendChild(createPreBlock(embedded.text));
        }
        container.appendChild(createPreBlock(JSON.stringify(embedded.json, null, 2)));
        return;
    }

    const javaObject = splitMessageAndJavaObject(message);
    if (javaObject) {
        if (javaObject.text) {
            container.appendChild(createPreBlock(javaObject.text));
        }
        container.appendChild(createPreBlock(prettyFormatJavaObject(javaObject.objectText)));
        return;
    }

    container.appendChild(createPreBlock(message));
}

function appendStackTrace(container, json) {
    const stack = getStackValue(json);
    if (!stack) return;

    const details = createElement('details', 'tm-details');
    const summary = createElement('summary', '', 'Stack Trace');
    const body = createPreBlock(
        String(stack)
            .replace(/\\r\\n/g, '\n')
            .replace(/\\n/g, '\n')
            .replace(/\\t/g, '\t')
    );

    details.append(summary, body);
    container.appendChild(details);
}

function buildLogContainer(json, level) {
    const container = createElement('div', `tm-container tm-sev-${level}`);
    container.dataset.level = level;

    appendMetaLine(container, json, level);
    appendCompactJson(container, json);
    appendMessage(container, json);
    appendStackTrace(container, json);

    return container;
}

function isAlreadyRendered(element, raw) {
    const previousRaw = renderedRawCache.get(element);
    const hasContainer = !!getRenderedContainer(element);

    return (
        previousRaw === raw &&
        element.classList.contains('tm-done') &&
        hasContainer
    );
}

export function formatJsonDiv(element) {
    if (!element || !element.isConnected) return;
    if (element.dataset.tmWorking === '1') return;

    const raw = getRawText(element);
    if (isAlreadyRendered(element, raw)) return;

    const json = getParsedJson(element);
    if (!json || typeof json !== 'object') return;

    element.dataset.tmWorking = '1';

    try {
        const level = getLevel(json);
        element.dataset.tmLevel = level;

        if (!state[level]) {
            hideLog(element);
            return;
        }

        showLog(element);
        removeRenderedContainerNear(element);
        unmarkHidden(element);

        const container = buildLogContainer(json, level);
        element.after(container);

        markHidden(element);
        renderedRawCache.set(element, raw);
    } finally {
        element.dataset.tmWorking = '0';
    }
}

export function flushQueue(deadline) {
    const hasDeadline = !!deadline && typeof deadline.timeRemaining === 'function';

    runtime.flushScheduled = false;

    while (queuedNodes.size) {
        const next = queuedNodes.values().next();
        if (next.done) break;

        const element = next.value;
        queuedNodes.delete(element);
        formatJsonDiv(element);

        if (hasDeadline && deadline.timeRemaining() < 4) break;
    }

    if (queuedNodes.size) scheduleFlush();
}

export function scheduleFlush() {
    if (runtime.flushScheduled) return;
    runtime.flushScheduled = true;

    if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(flushQueue, { timeout: 120 });
    } else {
        requestAnimationFrame(() => flushQueue({ timeRemaining: () => 8 }));
    }
}

export function enqueueNode(element) {
    if (!element || element.nodeType !== 1 || !element.isConnected) return;
    queuedNodes.add(element);
    scheduleFlush();
}

export function getAllRawJsonDivs() {
    return document.querySelectorAll(CONFIG.rawJsonSelector);
}

export function initialScan() {
    getAllRawJsonDivs().forEach(enqueueNode);
}

export function rerenderVisibleLogs(force = false) {
    getAllRawJsonDivs().forEach(element => {
        if (!element.isConnected) return;

        const json = getParsedJson(element);
        if (json && typeof json === 'object') {
            const level = getLevel(json);
            if (!state[level]) {
                hideLog(element);
                return;
            }
            showLog(element);
        }

        const raw = getRawText(element);
        const previousRaw = renderedRawCache.get(element);

        if (!force && previousRaw === raw && element.classList.contains('tm-done')) {
            return;
        }

        parsedCache.delete(element);
        removeRenderedContainerNear(element);
        unmarkHidden(element);
        enqueueNode(element);
    });
}

export function applyFilterStateToLog(element, level) {
    if (state[level]) {
        showLog(element);
        parsedCache.delete(element);
        removeRenderedContainerNear(element);
        unmarkHidden(element);
        enqueueNode(element);
    } else {
        hideLog(element);
    }
}

export function setAllDetailsOpen(isOpen) {
    document.querySelectorAll('.tm-details').forEach(details => {
        details.open = isOpen;
    });
}

export function expandAll() {
    setAllDetailsOpen(true);
}

export function collapseAll() {
    setAllDetailsOpen(false);
}