/* @layer renderer-app @kind types */
import type { Session } from '@archipelia/model';
import type { HostLogLine } from '@archipelia/hosts';

type ConsoleWidgetProps = { session: Session; lines: readonly HostLogLine[]; enabled: boolean };

export type { ConsoleWidgetProps };
