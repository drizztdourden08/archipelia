/* @layer core @kind logic */

const tupleVersion = (tuple: string): string => {
  const parts = tuple.split(',').map((part) => part.trim()).filter((part) => part.length > 0);
  while (parts.length < 3) parts.push('0');
  return parts.join('.');
};

export { tupleVersion };
