/* @layer client-kit @kind logic */
import { emitLines } from './emit-lines';

const emitYaml = (value: unknown): string => `${emitLines(value, 0).join('\n')}\n`;

export { emitYaml };
