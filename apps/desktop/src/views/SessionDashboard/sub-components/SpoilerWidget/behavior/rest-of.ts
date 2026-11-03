/* @layer renderer-app @kind logic */
const rest = /^( - |: )/;

const restOf = (location: string, area: string | null): string => (area ? location.slice(area.length).replace(rest, '') : location);

export { restOf };
