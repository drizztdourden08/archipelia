/* @layer protocol @kind logic */
import type { ErrorMessage } from '../messages/server.type';
import { ERROR_RULES } from '../protocol/error-rules.constants';

const closeCodeOf = (error: ErrorMessage): number | null => (error.fatal ? ERROR_RULES[error.code].close : null);

export { closeCodeOf };
