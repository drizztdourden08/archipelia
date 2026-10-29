/* @layer renderer-app @kind component */
import { Status, Tag } from '@drizztdourden08/tessera/primitives';
import type { StatusDef } from '@drizztdourden08/tessera/primitives';
import { useLocalServerStatus } from '../../../../hooks/useLocalServerStatus';
import { useServerPlace } from '../../../../hooks/useServerPlace';
import { LOBBY_PHASES } from '../../../../lobbies/lobby-statuses.constants';
import { LOBBY_SCREEN } from '../../SessionLobby.constants';
import { countLabel } from '../../behavior/count-label';
import { shownPhase } from '../../behavior/shown-phase';
import { ChangesChip } from '../ChangesChip';
import type { StageChipsProps } from './StageChips.type';

const StageChips = ({ lobby, serverId, direct, changes, count }: StageChipsProps) => {
  const place = useServerPlace(serverId);
  const { status } = useLocalServerStatus();
  const lan = place.local && status?.options.mode === 'lan';
  const phase: StatusDef | undefined = lobby ? LOBBY_PHASES[shownPhase(lobby.phase, direct)] : undefined;
  return (
    <>
      {phase
        ? <Status tone={phase.tone} pulse={phase.pulse} variant="pill" dot>{`${LOBBY_SCREEN.lobby} ${phase.label.toLowerCase()}`}</Status>
        : <Status tone="neutral" variant="pill" dot>{LOBBY_SCREEN.loading}</Status>}
      <Tag pill icon={lan ? 'wifi' : 'monitor'}>{lan ? LOBBY_SCREEN.lan : place.label}</Tag>
      <Tag pill icon="users">{countLabel(count)}</Tag>
      <ChangesChip changes={changes} />
    </>
  );
};

export { StageChips };
