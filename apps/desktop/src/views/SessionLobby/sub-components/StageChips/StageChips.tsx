/* @layer renderer-app @kind component */
import { Tag } from '@drizztdourden08/tessera/primitives';
import type { StatusDef } from '@drizztdourden08/tessera/primitives';
import { useLocalServerStatus } from '../../../../hooks/useLocalServerStatus';
import { useServerPlace } from '../../../../hooks/useServerPlace';
import { LOBBY_PHASES } from '../../../../lobbies/lobby-statuses.constants';
import { LOBBY_SCREEN } from '../../SessionLobby.constants';
import { countLabel } from '../../behavior/count-label';
import { phaseLook } from '../../behavior/phase-look';
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
      <Tag {...phaseLook(phase?.tone ?? 'neutral')} pill dot>{phase ? `${LOBBY_SCREEN.lobby} ${phase.label.toLowerCase()}` : LOBBY_SCREEN.loading}</Tag>
      <Tag pill icon={lan ? 'wifi' : 'monitor'}>{lan ? LOBBY_SCREEN.lan : place.label}</Tag>
      <Tag pill icon="users">{countLabel(count)}</Tag>
      <ChangesChip changes={changes} />
    </>
  );
};

export { StageChips };
