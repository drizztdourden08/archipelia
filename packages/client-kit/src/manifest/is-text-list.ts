/* @layer client-kit @kind logic */

const isTextList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

export { isTextList };
