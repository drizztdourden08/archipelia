/* @layer renderer-app @kind component */
import { PanelContainer, SettingsSection } from '@drizztdourden08/tessera/composites';
import { Stack } from '@drizztdourden08/tessera/primitives';
import type { DirectConnectionProps } from './DirectConnection.type';
import { directRows } from './behavior/direct-rows';
import { HostChoice } from '../HostChoice';
import { DirectLobby } from './sub-components/DirectLobby';
import { useConnectedCount } from '../../hooks/useConnectedCount';

const DirectConnection = (props: DirectConnectionProps) => {
  const { direct } = props;
  const connected = useConnectedCount(direct);
  return (
    <PanelContainer title="Direct connection">
      <Stack gap="sm">
        <SettingsSection id="direct-connection" rows={directRows(props)} />
        {direct && <HostChoice serverId={direct.serverId} locked={connected > 0} onServer={props.onServer} />}
        {direct && <DirectLobby direct={direct} />}
      </Stack>
    </PanelContainer>
  );
};

export { DirectConnection };
