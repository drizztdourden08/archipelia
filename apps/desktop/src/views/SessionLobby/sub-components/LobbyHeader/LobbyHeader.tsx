/* @layer renderer-app @kind component */
import { useId } from 'react';
import { formatLobbyCode } from '@drizztdourden08/archipelia-lobby-protocol';
import { ContentHeader, CopyValue } from '@drizztdourden08/tessera/composites';
import { Button, ButtonRow, Icon, Inline, Status, Text } from '@drizztdourden08/tessera/primitives';
import { useServerPlace } from '../../../../hooks/useServerPlace';
import { LOBBY_PHASES } from '../../../../lobbies/lobby-statuses.constants';
import { LOBBY_SCREEN } from '../../SessionLobby.constants';
import { shownPhase } from '../../behavior/shown-phase';
import { ChangesChip } from '../ChangesChip';
import type { LobbyHeaderProps } from './LobbyHeader.type';

const LobbyHeader = ({ name, lobby, serverId, direct, changes, busy, action, onEdit, onClose }: LobbyHeaderProps) => {
  const reasonId = useId();
  const place = useServerPlace(serverId);
  const live = lobby !== undefined && lobby.phase !== 'closed';
  const { reason } = action;
  const strip = (
    <Inline gap="sm" align="center" wrap>
      {lobby ? <Status map={LOBBY_PHASES} value={shownPhase(lobby.phase, direct)} dot /> : <Text variant="caption" tone="dim">{LOBBY_SCREEN.loading}</Text>}
      <Text variant="caption" tone="dim">{`${LOBBY_SCREEN.where}: ${place.label}`}</Text>
      <ChangesChip changes={changes} />
      {lobby && <CopyValue label={LOBBY_SCREEN.code} value={formatLobbyCode(lobby.code) ?? lobby.code} mono size="sm" copyLabel={LOBBY_SCREEN.codeCopy} />}
      {reason && <Text id={reasonId} variant="caption" tone="dim">{reason}</Text>}
    </Inline>
  );
  const actions = (
    <ButtonRow>
      <Button variant="ghost" icon={<Icon name="pencil" />} onClick={onEdit}>{LOBBY_SCREEN.edit}</Button>
      {live && <Button variant="secondary" icon={<Icon name="square" />} disabled={busy} onClick={onClose}>{LOBBY_SCREEN.close}</Button>}
      <Button variant="primary" disabled={busy || reason !== undefined} aria-describedby={reason && reasonId} onClick={action.onClick}>{action.label}</Button>
    </ButtonRow>
  );
  return <ContentHeader title={name} level={2} compact strip={strip} actions={actions} />;
};

export { LobbyHeader };
