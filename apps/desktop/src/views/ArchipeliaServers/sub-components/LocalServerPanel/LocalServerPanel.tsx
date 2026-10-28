/* @layer renderer-app @kind component */
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import { Box, Button, Icon, Stack, Status } from '@drizztdourden08/tessera/primitives';
import { TOUR_TARGET } from '../../../../hooks/tour-targets.constants';
import { SERVER_STATES } from '../../../../lobbies/lobby-statuses.constants';
import { networkRows } from '../../behavior/network-rows';
import type { LocalPanelProps } from '../../ArchipeliaServers.type';
import { LocalNotices } from '../LocalNotices';
import { PanelHeading } from '../PanelHeading';
import { ReachSummary } from '../ReachSummary';

const LocalServerPanel = ({ status, busy, error, onApply, onRefresh }: LocalPanelProps) => (
  <Stack>
    <PanelHeading
      title="This computer"
      status={<Status map={SERVER_STATES} value={status?.state} fallback="starting" dot />}
      actions={<Button size="sm" variant="secondary" icon={<Icon name="refresh-cw" />} onClick={onRefresh}>Refresh</Button>}
    />
    <LocalNotices status={status} error={error} />
    {status && (
      <Box data-tour={TOUR_TARGET.serversDetail}>
        <SettingsSection id="network" title="Network" rows={networkRows(status.options, busy, onApply)} />
      </Box>
    )}
    {status && <ReachSummary status={status} />}
  </Stack>
);

export { LocalServerPanel };
