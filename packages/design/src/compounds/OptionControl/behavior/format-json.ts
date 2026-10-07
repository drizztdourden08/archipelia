/* @layer renderer-app @kind logic */
import { JSON_INDENT } from './json-text.constants';

const formatJson = (value: unknown): string => {
  const text = JSON.stringify(value, null, JSON_INDENT) as string | undefined;
  return text ?? '';
};

export { formatJson };
