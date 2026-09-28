/* @layer renderer-app @kind logic */
const textValue = (raw: unknown): string => (raw === undefined || raw === null ? '' : String(raw));

export { textValue };
