/* @layer core @kind logic */
const check = (name: string, value: Record<string, unknown>, allowed: readonly string[]): void => {
  const unknown = Object.keys(value).filter((key) => !allowed.includes(key));
  if (unknown.length > 0) throw new Error(`${name} does not take ${unknown.join(', ')}`);
};

export { check };
