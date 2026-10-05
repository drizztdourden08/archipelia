/* @layer renderer-app @kind logic */
import { EMPTY_PROBLEM, ERROR_LINE, SHAPE_PROBLEMS } from './json-text.constants';
import type { JsonRead, JsonShape } from './json-text.type';

const fitsShape = (value: unknown, shape: JsonShape): boolean =>
  (shape === 'array' ? Array.isArray(value) : typeof value === 'object' && value !== null && !Array.isArray(value));

const lineOf = (message: string): number | undefined => {
  const found = ERROR_LINE.exec(message)?.[1];
  return found === undefined ? undefined : Number(found);
};

const readJsonText = (text: string, shape: JsonShape): JsonRead => {
  if (text.trim() === '') return { problem: { message: EMPTY_PROBLEM, line: 1 } };
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { problem: { message, line: lineOf(message) } };
  }
  return fitsShape(value, shape) ? { value, problem: null } : { problem: { message: SHAPE_PROBLEMS[shape], line: 1 } };
};

export { readJsonText };
