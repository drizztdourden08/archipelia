/* @layer renderer-app @kind component */
import { useId } from 'react';
import { ContentHeader } from '@drizztdourden08/tessera/composites';
import { Button, ButtonRow, Icon, Inline, Status, Text } from '@drizztdourden08/tessera/primitives';
import { LOBBY_PHASES } from '../../../../lobbies/lobby-statuses.constants';
import { LOBBY_SCREEN } from '../../SessionLobby.constants';
import { shownPhase } from '../../behavior/shown-phase';
import type { LobbyHeaderProps } from './LobbyHeader.type';

const LobbyHeader = ({ name, phase, direct, saved, busy, action, onSave, onEdit, onClose }: LobbyHeaderProps) => {
  const reasonId = useId();
  const live = phase !== undefined && phase !== 'closed';
  const { reason } = action;
  const strip = (
    <Inline gap="sm" align="center">
      {phase ? <Status map={LOBBY_PHASES} value={shownPhase(phase, direct)} dot /> : <Text variant="caption" tone="dim">{LOBBY_SCREEN.notOpen}</Text>}
      {saved && <Text variant="caption">Saved</Text>}
      {reason && <Text id={reasonId} variant="caption" tone="dim">{reason}</Text>}
    </Inline>
  );
  const actions = (
    <ButtonRow>
      <Button variant="ghost" icon={<Icon name="pencil" />} onClick={onEdit}>{LOBBY_SCREEN.edit}</Button>
      {live && <Button variant="secondary" icon={<Icon name="square" />} disabled={busy} onClick={onClose}>{LOBBY_SCREEN.close}</Button>}
      {live && <Button variant="secondary" disabled={busy} onClick={onSave}>Save</Button>}
      <Button variant="primary" disabled={busy || reason !== undefined} aria-describedby={reason && reasonId} onClick={action.onClick}>{action.label}</Button>
    </ButtonRow>
  );
  return <ContentHeader title={name} level={2} compact strip={strip} actions={actions} />;
};

export { LobbyHeader };
