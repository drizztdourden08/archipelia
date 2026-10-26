/* @layer core @kind logic */

const normalizePackageName = (name: string): string => name.replace(/[-_.]+/g, '-').toLowerCase();

export { normalizePackageName };
