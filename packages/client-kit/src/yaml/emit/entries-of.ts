/* @layer client-kit @kind logic */

const entriesOf = (value: Record<string, unknown>): [string, unknown][] =>
  Object.entries(value).filter(([, child]) => child !== undefined);

export { entriesOf };
