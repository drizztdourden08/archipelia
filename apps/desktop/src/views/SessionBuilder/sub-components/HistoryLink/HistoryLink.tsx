/* @layer renderer-app @kind component */
import { Button, Icon } from '@drizztdourden08/tessera/primitives';
import { openHistory } from '../../../../hooks/open-history';
import { historyLabel } from '../../behavior/history-label';
import type { HistoryLinkProps } from './HistoryLink.type';

const HistoryLink = ({ sessionId, runs }: HistoryLinkProps) => (
  <Button size="sm" variant="ghost" icon={<Icon name="history" />} onClick={() => openHistory(sessionId)}>{historyLabel(runs)}</Button>
);

export { HistoryLink };
