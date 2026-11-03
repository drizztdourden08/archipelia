/* @layer core @kind logic */
import type { ConsoleValues } from '../console-command.type';
import { valueOf } from './value-of';

const wholeNumber = (values: ConsoleValues, name: string, max: number, fallback: number): number => {
  const parsed = Math.trunc(Number(valueOf(values, name)));
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
};

export { wholeNumber };
