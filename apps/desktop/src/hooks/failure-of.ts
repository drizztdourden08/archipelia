/* @layer renderer-app @kind logic */
import { OTHER_FAILURE } from './lobby-hooks.constants';

const failureOf = (failures: Readonly<Record<string, string>>) => (key: string): string => {
  const [action = ''] = key.split('-');
  return Object.hasOwn(failures, action) ? (failures[action] ?? OTHER_FAILURE) : OTHER_FAILURE;
};

export { failureOf };
