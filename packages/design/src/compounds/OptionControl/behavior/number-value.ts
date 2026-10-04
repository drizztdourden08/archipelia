/* @layer renderer-app @kind logic */
const numberValue = (raw: unknown): number | undefined =>
  (typeof raw === 'number' && Number.isFinite(raw) ? raw : undefined);

export { numberValue };
