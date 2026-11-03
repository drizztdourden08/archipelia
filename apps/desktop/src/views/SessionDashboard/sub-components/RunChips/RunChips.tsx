/* @layer renderer-app @kind component */
import { Tag } from '@drizztdourden08/tessera/primitives';
import { RUN_STATUS } from '@archipelia/design';
import { countLabel } from '../../../SessionLobby/behavior/count-label';
import { phaseLook } from '../../../SessionLobby/behavior/phase-look';
import { progressLabel } from '../../behavior/progress-label';
import { RUN_STAGE_TEXT } from '../../behavior/run-stage.constants';
import type { RunChipsProps } from './RunChips.type';

const RunChips = ({ status, job, place, lan, count, uptime }: RunChipsProps) => {
  const look = RUN_STATUS[status];
  const label = status === 'hosting' ? RUN_STAGE_TEXT.running : look.label;
  const percent = progressLabel(job);
  return (
    <>
      <Tag {...phaseLook(look.tone)} pill dot>{percent ? `${label} ${percent}` : label}</Tag>
      <Tag pill icon={lan ? 'wifi' : 'monitor'}>{lan ? RUN_STAGE_TEXT.lan : place}</Tag>
      <Tag pill icon="users">{countLabel(count)}</Tag>
      {uptime && <Tag pill icon="clock">{`${RUN_STAGE_TEXT.up} ${uptime}`}</Tag>}
    </>
  );
};

export { RunChips };
