/* @layer renderer-app @kind logic */
import { ACTION_KEYS, FAILURE } from '../SessionBuilder.constants';

const isAction = (action: string): action is (typeof ACTION_KEYS)[number] => (ACTION_KEYS as readonly string[]).includes(action);

const failureOf = (key: string): string => {
  const [action = ''] = key.split('-');
  return isAction(action) ? FAILURE[action] : FAILURE.other;
};

export { failureOf };
