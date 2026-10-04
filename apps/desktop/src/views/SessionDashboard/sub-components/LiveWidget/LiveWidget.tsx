/* @layer renderer-app @kind component */
import type { LiveWidgetProps } from './LiveWidget.type';
import { useLiveRoom } from '../../behavior/useLiveRoom';
import { HintsPanel } from '../HintsPanel';
import { PlayersPanel } from '../PlayersPanel';
import { RoomWidget } from '../RoomWidget';

const LiveWidget = ({ id, session, lines }: LiveWidgetProps) => {
  const { players, hints, phase, error, passwordRequired, submitPassword } = useLiveRoom(session, lines);
  if (id === 'players') return <PlayersPanel rows={players} phase={phase} error={error} onPassword={submitPassword} />;
  if (id === 'hints') return <HintsPanel rows={hints} phase={phase} error={error} onPassword={submitPassword} />;
  return <RoomWidget session={session} passwordRequired={passwordRequired} />;
};

export { LiveWidget };
