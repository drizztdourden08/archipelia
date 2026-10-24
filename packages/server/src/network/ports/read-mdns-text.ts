/* @layer core @kind logic */
const readMdnsText = (value: unknown): string | null => {
  if (typeof value === 'string') return value;
  return value instanceof Uint8Array ? Buffer.from(value).toString('utf8') : null;
};

export { readMdnsText };
