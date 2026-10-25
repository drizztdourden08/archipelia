/* @layer core @kind logic */

const packagePlural = (names: string[]) => (names.length > 1 ? 'packages' : 'package');

export { packagePlural };
