/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import { sourceNameOf } from './source-name';

const sourceKeyOf = (run: Session): string => run.source?.sessionId ?? `name:${sourceNameOf(run)}`;

export { sourceKeyOf };
