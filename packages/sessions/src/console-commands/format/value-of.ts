/* @layer core @kind logic */
import type { ConsoleValues } from '../console-command.type';

const valueOf = (values: ConsoleValues, name: string): string => String(values[name] ?? '').trim();

export { valueOf };
