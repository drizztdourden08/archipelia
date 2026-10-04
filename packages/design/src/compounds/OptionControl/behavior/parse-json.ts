/* @layer renderer-app @kind logic */
import type { JsonValue, OptionValue } from '@archipelia/model';
import type { JsonParse, JsonShape } from './json-text.type';

const fitsShape = (value: JsonValue, shape: JsonShape) =>
  (shape === 'list' ? Array.isArray(value) : typeof value === 'object' && value !== null && !Array.isArray(value));

const parseJson = (text: string, shape: JsonShape): JsonParse => {
  try {
    const value = JSON.parse(text) as JsonValue;
    if (!fitsShape(value, shape)) return { error: shape === 'list' ? 'Expected a JSON list, like ["a", "b"]' : 'Expected a JSON table, like {"name": 1}' };
    return { value: value as OptionValue };
  } catch (err) {
    return { error: `Not valid JSON: ${(err as Error).message}` };
  }
};

export { parseJson };
