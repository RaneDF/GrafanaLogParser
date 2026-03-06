import { injectStyles } from './styles.js';
import { createToolbar, setupCopyDelegation } from './toolbar.js';
import { initialScan } from './renderer.js';
import { setupObserver, setupRefreshClickHook } from './observer.js';

function isSupportedLogsPage() {
    const path = window.location.pathname || '';
    const search = window.location.search || '';

    const looksLikeGrafanaLogsPath =
        path.startsWith('/explore') ||
        path.startsWith('/d/') ||
        path.startsWith('/a/');

    const hasLogsIndicators =
        search.includes('var-search=') ||
        search.includes('var-service=') ||
        search.includes('var-namespace=') ||
        document.body?.innerText?.includes('traceId') ||
        document.body?.innerText?.includes('"level"') ||
        document.body?.innerText?.includes('"timestamp"');

    return looksLikeGrafanaLogsPath && hasLogsIndicators;
}

function bootstrap() {
    if (!isSupportedLogsPage()) return;

    injectStyles();
    createToolbar();
    setupCopyDelegation();
    initialScan();
    setupObserver();
    setupRefreshClickHook();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
    bootstrap();
}