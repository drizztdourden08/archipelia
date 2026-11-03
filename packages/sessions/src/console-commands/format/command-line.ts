/* @layer core @kind logic */
const commandLine = (id: string, ...parts: readonly string[]): string => [`/${id}`, ...parts.filter((part) => part !== '')].join(' ');

export { commandLine };
