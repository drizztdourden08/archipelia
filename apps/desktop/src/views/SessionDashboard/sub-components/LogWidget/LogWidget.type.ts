/* @layer renderer-app @kind types */
import type { Session } from '@archipelia/model';
import type { HostLogLine } from '@archipelia/hosts';

type LogWidgetProps = { session: Session; lines: readonly HostLogLine[] };

export type { LogWidgetProps };
