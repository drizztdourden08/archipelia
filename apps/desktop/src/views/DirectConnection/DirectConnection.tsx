/* @layer renderer-app @kind component */
import { PanelContainer, SettingsSection } from '@drizztdourden08/tessera/composites';
import { Stack } from '@drizztdourden08/tessera/primitives';
import type { DirectConnectionProps } from './DirectConnection.type';
import { directRows } from './behavior/direct-rows';
import { HostChoice } from '../HostChoice';
import { DirectLobby } from './sub-components/DirectLobby';

const DirectConnection = (props: DirectConnectionProps) => {
  const { direct } = props;
  return (
    <PanelContainer title="Direct connection">
      <Stack gap="sm">
        <SettingsSection id="direct-connection" rows={directRows(props)} />
        <HostChoice lockedServer={direct?.serverId} />
        {direct && <DirectLobby direct={direct} />}
      </Stack>
    </PanelContainer>
  );
};

export { DirectConnection };
