/* @layer renderer-app @kind logic */
const groupKeyOf = (kind: 'item' | 'location', game: string): string => `_read_${kind}_name_groups_${game}`;

const groupNamesOf = (value: unknown): string[] =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? Object.keys(value) : [];

export { groupKeyOf, groupNamesOf };
