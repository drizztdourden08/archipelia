/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import { UNKNOWN_SOURCE_NAME } from '@archipelia/model';

const sourceNameOf = (run: Session): string => run.source?.sessionName ?? UNKNOWN_SOURCE_NAME;

export { sourceNameOf };
