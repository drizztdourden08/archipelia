/* @layer core @kind logic */

const isRepoId = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value > 0;

export { isRepoId };
