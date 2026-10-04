/* @layer renderer-app @kind logic */
import type { OptionValue } from '@archipelia/model';

const stringList = (value: OptionValue): string[] =>
  (Array.isArray(value) ? value.map((item) => (typeof item === 'string' ? item : JSON.stringify(item))) : []);

export { stringList };
