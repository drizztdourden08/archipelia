/* @layer core @kind logic */
import type { SchemaRead } from '@archipelia/engine';
import { ERROR_LINE } from './read-game-schema.constants';

const causeOf = ({ lines }: SchemaRead) => lines.filter((line) => ERROR_LINE.test(line)).at(-1)?.trim();

export { causeOf };
