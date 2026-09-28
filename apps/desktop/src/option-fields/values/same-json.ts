/* @layer renderer-app @kind logic */
import type { OptionValue } from '@archipelia/model';
import type { JsonShape } from './json-text.type';
import { parseJson } from './parse-json';

const sameJson = (text: string, value: OptionValue, shape: JsonShape) => {
  const parsed = parseJson(text, shape);
  return parsed.error === undefined && JSON.stringify(parsed.value) === JSON.stringify(value);
};

export { sameJson };
