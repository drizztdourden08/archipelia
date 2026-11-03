/* @layer core @kind logic */
const PLAIN_ARG = /^[^\s"'\\]+$/;

const quoteArg = (value: string): string => {
  if (PLAIN_ARG.test(value)) return value;
  return `"${value.replace(/[\\"]/g, '\\$&')}"`;
};

export { quoteArg };
