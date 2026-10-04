/* @layer renderer-app @kind types */
import type { HostLogLine } from '@archipelia/hosts';
import type { Session } from '@archipelia/model';

type PlayersWidgetProps = { session: Session; lines: readonly HostLogLine[] };

export type { PlayersWidgetProps };
