import { LEVELS } from './config.js';

export const state = Object.fromEntries(LEVELS.map(level => [level, true]));

export const parsedCache = new WeakMap();
export const renderedRawCache = new WeakMap();
export const queuedNodes = new Set();

export const runtime = {
    flushScheduled: false,
    observer: null,
    refreshTimer: null
};