/* @layer renderer-app @kind logic */
const isStringList = (value: unknown) => Array.isArray(value) && value.every((item) => typeof item === 'string');

export { isStringList };
