/* @layer renderer-app @kind logic */
import type { OptionKind } from '@archipelia/model';

const tagsValue = (kind: OptionKind, next: readonly string[]): string[] =>
  (kind === 'set' ? [...new Set(next)].sort() : [...next]);

export { tagsValue };
