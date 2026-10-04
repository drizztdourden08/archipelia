/* @layer renderer-app @kind types */
import type { HostLogLine } from '@archipelia/hosts';
import type { Session } from '@archipelia/model';
import type { LiveWidgetId } from '../../../../session-widgets/session-widget.type';

type LiveWidgetProps = { id: LiveWidgetId; session: Session; lines: readonly HostLogLine[] };

export type { LiveWidgetProps };
