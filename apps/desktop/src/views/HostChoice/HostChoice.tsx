/* @layer renderer-app @kind component */
import { PanelContainer } from '@drizztdourden08/tessera/composites';
import { RadioGroup, Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import type { HostChoiceProps } from './HostChoice.type';
import { useHostChoice } from './behavior/useHostChoice';
import { NetworkState } from './sub-components/NetworkState';
import { RemoteChoice } from './sub-components/RemoteChoice';

const HostChoice = ({ lockedServer }: HostChoiceProps) => {
  const model = useHostChoice(lockedServer);
  const { status, where } = model;
  return (
    <PanelContainer title="Where to host">
      <Stack gap="sm">
        <RadioGroup label="Where to host" value={where} options={model.options} onChange={model.choose} disabled={!model.ready || model.busy} />
        {model.error && <ErrorCallout message={model.error} />}
        {where !== 'remote' && status && <NetworkState open={where === 'lan'} status={status} busy={model.busy} onStop={model.stop} />}
        {where === 'remote' && (
          <RemoteChoice
            serverId={model.serverId} entries={model.entries} place={model.place} stillOpen={model.stillOpen} busy={model.busy} locked={model.locked}
            onSelect={model.pickServer} onStop={model.stop} onManage={model.manageServers}
          />
        )}
      </Stack>
    </PanelContainer>
  );
};

export { HostChoice };
