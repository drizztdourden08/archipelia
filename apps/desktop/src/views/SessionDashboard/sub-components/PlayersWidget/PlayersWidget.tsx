/* @layer renderer-app @kind component */
import type { PlayersWidgetProps } from './PlayersWidget.type';
import { useLiveRoom } from '../../behavior/useLiveRoom';
import { PlayersPanel } from '../PlayersPanel';

const PlayersWidget = ({ session, lines }: PlayersWidgetProps) => {
  const { players, connection } = useLiveRoom(session, lines);
  return <PlayersPanel rows={players} connection={connection} />;
};

export { PlayersWidget };
