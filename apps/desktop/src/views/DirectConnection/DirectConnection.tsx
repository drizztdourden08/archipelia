/* @layer renderer-app @kind component */
import { PanelContainer, SettingsSection } from '@drizztdourden08/tessera/composites';
import { Callout, Stack } from '@drizztdourden08/tessera/primitives';
import type { DirectConnectionProps } from './DirectConnection.type';
import { directRows } from './behavior/direct-rows';
import { HostChoice } from '../HostChoice';
import { DirectLobby } from './sub-components/DirectLobby';
import { useConnectedCount } from '../../hooks/useConnectedCount';
import { usePendingCloses } from '../../hooks/usePendingCloses';
import { TEXT } from './DirectConnection.constants';

const DirectConnection = (props: DirectConnectionProps) => {
  const { direct } = props;
  const connected = useConnectedCount(direct);
  const closing = usePendingCloses(props.templateId);
  return (
    <PanelContainer title="Direct connection">
      <Stack gap="sm">
        <SettingsSection id="direct-connection" rows={directRows(props)} />
        {closing.length > 0 && <Callout tone="warning">{TEXT.closing}</Callout>}
        {direct && <HostChoice serverId={direct.serverId} locked={connected > 0} onServer={props.onServer} />}
        {direct && <DirectLobby direct={direct} />}
      </Stack>
    </PanelContainer>
  );
};

export { DirectConnection };
