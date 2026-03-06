export const CONFIG = {
    rawJsonSelector: 'div.css-ckyukb',
    toolbarId: 'tm-victoria-toolbar',
    styleId: 'tm-vic-style'
};

export const META_KEYS = [
    'timestamp',
    'level',
    'traceId',
    'logger_name',
    'thread_name',
    'spanId'
];

export const LEVELS = ['ERROR', 'WARN', 'INFO', 'DEBUG'];

export const LEVEL_COLORS = {
    ERROR: '#E53935',
    WARN: '#FF9800',
    INFO: '#43A047',
    DEBUG: '#42A5F5'
};

export const STACK_KEYS = [
    'stack_trace',
    'stackTrace',
    'stacktrace',
    'exception',
    'errorStack',
    'throwable'
];