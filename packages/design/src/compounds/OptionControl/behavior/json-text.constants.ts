/* @layer renderer-app @kind config */
import type { JsonShape } from './json-text.type';

const JSON_INDENT = 2;

const ERROR_LINE = /line (\d+)/;

const EMPTY_PROBLEM = 'Write a JSON value, such as {}';

const SHAPE_PROBLEMS: Readonly<Record<JsonShape, string>> = {
  object: 'Write an object in braces { }',
  array: 'Write a list in brackets [ ]',
};

export { EMPTY_PROBLEM, ERROR_LINE, JSON_INDENT, SHAPE_PROBLEMS };
