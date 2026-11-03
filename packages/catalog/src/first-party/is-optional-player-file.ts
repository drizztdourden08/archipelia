/* @layer core @kind logic */

const isOptionalPlayerFile = (value: unknown): boolean => value === undefined || value === 'options' || value === 'app';

export { isOptionalPlayerFile };
