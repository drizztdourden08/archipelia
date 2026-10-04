/* @layer renderer-app @kind component */
import type { PlayersWidgetProps } from './PlayersWidget.type';
import { useLiveRoom } from '../../behavior/useLiveRoom';
import { PlayersPanel } from '../PlayersPanel';

const PlayersWidget = ({ session, lines }: PlayersWidgetProps) => {
  const { players, phase, error, submitPassword, retry } = useLiveRoom(session, lines);
  return <PlayersPanel rows={players} phase={phase} error={error} onPassword={submitPassword} onRetry={retry} />;
};

export { PlayersWidget };
