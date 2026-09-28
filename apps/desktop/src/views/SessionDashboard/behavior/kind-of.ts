/* @layer renderer-app @kind logic */
import { KIND_RULES } from '../SessionDashboard.constants';

const kindOf = (text: string) => KIND_RULES.find(([pattern]) => pattern.test(text))?.[1] ?? 'info';

export { kindOf };
