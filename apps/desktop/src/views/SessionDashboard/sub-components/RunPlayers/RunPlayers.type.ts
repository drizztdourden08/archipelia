/* @layer renderer-app @kind types */
import type { Session } from '@archipelia/model';
import type { PlayerView } from '@archipelia/sessions/live-room';

type RunPlayersProps = { session: Session; rows: readonly PlayerView[] };

export type { RunPlayersProps };
