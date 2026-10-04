/* @layer renderer-app @kind config */
const LIVE = new Set(['generating', 'starting', 'hosting']);

const DAY_MS = 24 * 60 * 60 * 1000;

const CLEAN_DAYS = 30;

export { CLEAN_DAYS, DAY_MS, LIVE };
