/* @layer core @kind logic */

const longestFirst = (names: readonly string[]): string[] => [...names].sort((a, b) => b.length - a.length);

export { longestFirst };
