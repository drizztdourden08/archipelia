/* @layer core @kind logic */

const moduleNameOf = (name: string): string => name.replace(/[-.]+/g, '_');

export { moduleNameOf };
