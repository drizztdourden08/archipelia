/* @layer core @kind logic */
import { PLAIN_ARG } from './quote-arg.constants';

const quoteArg = (value: string): string => {
  if (PLAIN_ARG.test(value)) return value;
  return `"${value.replace(/[\\"]/g, '\\$&')}"`;
};

export { quoteArg };
