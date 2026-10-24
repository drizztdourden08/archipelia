/* @layer client-kit @kind logic */

const comparePaths = (left: string, right: string): number => {
  if (left === right) return 0;
  return left < right ? -1 : 1;
};

export { comparePaths };
