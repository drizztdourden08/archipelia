/* @layer core @kind logic */
import { isText } from './is-text';

const isTextList = (value: unknown): value is string[] => Array.isArray(value) && value.every(isText);

export { isTextList };
