export function createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent !== undefined) element.textContent = textContent;
    return element;
}

export function createPreBlock(text) {
    return createElement('pre', 'tm-block', String(text));
}

export function createMetaItem(label, value) {
    const element = createElement('div', 'tm-meta-secondary', `${label}:${value}`);
    element.dataset.copy = String(value);
    return element;
}

export function createTraceItem(traceId) {
    const element = createElement('div', 'tm-meta-link', `trace:${traceId}`);
    element.dataset.traceId = String(traceId);
    element.title = 'Open logs filtered by traceId';
    return element;
}

export function buildTraceSearchUrl(traceId) {
    const url = new URL(window.location.href);
    url.searchParams.set('var-search', traceId);
    return url.toString();
}

export function getRenderedContainer(element) {
    const next = element?.nextElementSibling;
    return next?.classList?.contains('tm-container') ? next : null;
}

export function removeRenderedContainerNear(element) {
    getRenderedContainer(element)?.remove();
}

export function markHidden(element) {
    element.style.display = 'none';
    element.classList.add('tm-done');
}

export function unmarkHidden(element) {
    element.style.display = '';
    element.classList.remove('tm-done');
}

export function findLogRow(element) {
    return (
        element.closest('tr') ||
        element.closest('[role="row"]') ||
        element.closest('[class*="logs-row"]') ||
        element.closest('[class*="row"]') ||
        element.parentElement
    );
}

export function hideLog(element) {
    if (!element) return;

    removeRenderedContainerNear(element);
    unmarkHidden(element);

    const row = findLogRow(element);
    if (!row) return;

    row.dataset.tmHidden = '1';
    row.style.display = 'none';
}

export function showLog(element) {
    if (!element) return;

    const row = findLogRow(element);
    if (row && row.dataset.tmHidden === '1') {
        row.style.display = '';
        delete row.dataset.tmHidden;
    }
}

export function showCopiedFeedback(element) {
    const originalText = element.textContent;
    element.textContent = 'copied';

    setTimeout(() => {
        if (element.isConnected) {
            element.textContent = originalText;
        }
    }, 700);
}