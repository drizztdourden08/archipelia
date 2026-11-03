/* @layer renderer-app @kind logic */
const groupKeyOf = (kind: 'item' | 'location', game: string): string => `_read_${kind}_name_groups_${game}`;

export { groupKeyOf };
