/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import type { SessionWidgetsProps } from './SessionWidgets.type';
import { ConsoleWidget } from '../ConsoleWidget';
import { HintsPanel } from '../HintsPanel';
import { LogWidget } from '../LogWidget';
import { PlayersPanel } from '../PlayersPanel';
import { RoomWidget } from '../RoomWidget';
import { SessionDock } from '../SessionDock';
import { SpoilerWidget } from '../SpoilerWidget';

const SessionWidgets = ({ session, lines, live, layout, onUpdate, onClose }: SessionWidgetsProps) => {
  const { players, hints, phase, error, passwordRequired, submitPassword } = live;
  const content = useMemo(() => ({
    players: <PlayersPanel rows={players} phase={phase} error={error} onPassword={submitPassword} />,
    hints: <HintsPanel rows={hints} phase={phase} error={error} onPassword={submitPassword} />,
    log: <LogWidget session={session} lines={lines} />,
    console: <ConsoleWidget session={session} enabled={session.status === 'hosting'} />,
    spoiler: <SpoilerWidget session={session} />,
    room: <RoomWidget session={session} passwordRequired={passwordRequired} />,
  }), [session, lines, players, hints, phase, error, passwordRequired, submitPassword]);
  return <SessionDock layout={layout} content={content} onUpdate={onUpdate} onClose={onClose} />;
};

export { SessionWidgets };
