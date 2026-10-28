/* @layer renderer-app @kind logic */
const coreOf = (version: string): string => version.split(/[-+]/)[0] ?? version;

export { coreOf };
