/* @layer renderer-app @kind logic */
const groupNamesOf = (value: unknown): string[] =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? Object.keys(value) : [];

export { groupNamesOf };
