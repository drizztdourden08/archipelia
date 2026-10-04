/* @layer renderer-app @kind config */
const LIVE = new Set(['generating', 'starting', 'hosting']);

const DAY_MS = 24 * 60 * 60 * 1000;

const CLEAN_DAYS = 30;

const CLEAN_FAILED = 'Could not remove the old runs.';

export { CLEAN_DAYS, CLEAN_FAILED, DAY_MS, LIVE };
