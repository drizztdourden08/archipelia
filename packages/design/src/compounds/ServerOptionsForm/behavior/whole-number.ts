/* @layer renderer-app @kind logic */
const wholeNumber = (value: number, max = Number.MAX_SAFE_INTEGER): number => (Number.isFinite(value) ? Math.min(max, Math.max(0, Math.round(value))) : 0);

export { wholeNumber };
