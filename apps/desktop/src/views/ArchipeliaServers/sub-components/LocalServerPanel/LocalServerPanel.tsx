/* @layer renderer-app @kind component */
import { FactsPanel, SettingsSection } from '@drizztdourden08/tessera/composites';
import { Box, Button, Icon, Stack, Status } from '@drizztdourden08/tessera/primitives';
import { TOUR_TARGET } from '../../../../hooks/tour-targets.constants';
import { SERVER_STATES } from '../../../../lobbies/lobby-statuses.constants';
import { networkRows } from '../../behavior/network-rows';
import { reachFacts } from '../../behavior/reach-facts';
import type { LocalPanelProps } from '../../ArchipeliaServers.type';
import { LocalNotices } from '../LocalNotices';
import { PanelHeading } from '../PanelHeading';

const LocalServerPanel = ({ status, names, busy, error, onApply, onRefresh }: LocalPanelProps) => {
  const facts = status ? reachFacts(status, names) : [];
  return (
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
      {facts.length > 0 && <FactsPanel label="Reach" groups={[facts]} layout="boxed" />}
    </Stack>
  );
};

export { LocalServerPanel };
