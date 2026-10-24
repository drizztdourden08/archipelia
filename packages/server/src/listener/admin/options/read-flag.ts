/* @layer core @kind logic */
const readFlag = (name: string, value: unknown): boolean => {
  if (typeof value !== 'boolean') throw new Error(`${name} must be true or false`);
  return value;
};

export { readFlag };
