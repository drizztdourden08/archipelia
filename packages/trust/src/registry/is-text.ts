/* @layer core @kind logic */

const isText = (value: unknown): value is string => typeof value === 'string' && value.length > 0;

export { isText };
