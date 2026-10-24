/* @layer core @kind logic */

const isOptionalText = (value: unknown): boolean => value === undefined || (typeof value === 'string' && value.length > 0);

export { isOptionalText };
