/* @layer core @kind logic */

const quoted = (arg: string): string => (arg === '' || /[\s"]/.test(arg) ? `"${arg.replaceAll('"', '\\"')}"` : arg);

const shownOf = (name: string, args: readonly string[]): string => [name, ...args.map(quoted)].join(' ');

export { shownOf };
