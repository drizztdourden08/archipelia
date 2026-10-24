/* @layer protocol @kind logic */

const childPath = (path: string, key: string | number): string => {
  if (typeof key === 'number') return `${path}[${key}]`;
  return path === '' ? key : `${path}.${key}`;
};

export { childPath };
