/* @layer renderer-app @kind component */
import { PanelContainer } from '@drizztdourden08/tessera/composites';
import { RadioGroup, Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { WHERE_OPTIONS } from './HostChoice.constants';
import { useHostChoice } from './behavior/useHostChoice';
import { NetworkState } from './sub-components/NetworkState';
import { RemoteChoice } from './sub-components/RemoteChoice';

const HostChoice = () => {
  const model = useHostChoice();
  const { status, where } = model;
  return (
    <PanelContainer title="Where to host">
      <Stack gap="sm">
        <RadioGroup label="Where to host" value={where} options={WHERE_OPTIONS} onChange={model.choose} disabled={!model.ready || model.busy} />
        {model.error && <ErrorCallout message={model.error} />}
        {where !== 'remote' && status && <NetworkState open={where === 'lan'} status={status} busy={model.busy} onStop={model.stop} />}
        {where === 'remote' && (
          <RemoteChoice
            serverId={model.serverId} entries={model.entries} place={model.place} stillOpen={model.stillOpen} busy={model.busy}
            onSelect={model.pickServer} onStop={model.stop} onManage={model.manageServers}
          />
        )}
      </Stack>
    </PanelContainer>
  );
};

export { HostChoice };
