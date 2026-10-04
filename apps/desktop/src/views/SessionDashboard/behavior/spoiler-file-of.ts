/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import { OUTPUT_DIR } from '../SessionDashboard.constants';

const spoilerFileOf = (session: Session): string | null => (session.output?.spoiler ? `${OUTPUT_DIR}/${session.output.spoiler}` : null);

export { spoilerFileOf };
