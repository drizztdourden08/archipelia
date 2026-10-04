/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera/primitives';
import { GenerationFields } from './sub-components/GenerationFields';
import { HostFields } from './sub-components/HostFields';
import { ServerFields } from './sub-components/ServerFields';
import type { ServerOptionsFormProps } from './ServerOptionsForm.type';

const ServerOptionsForm = (props: ServerOptionsFormProps) => {
  const {
    generator, server, host, serverOptions, password, hasPassword,
    onGenerator, onServer, onHostKind, onPort, onRemoteServer, onPassword, onClearPassword,
  } = props;
  return (
    <Stack gap="md">
      <GenerationFields generator={generator} onGenerator={onGenerator} />
      <HostFields
        host={host}
        serverOptions={serverOptions}
        password={password}
        hasPassword={hasPassword}
        onHostKind={onHostKind}
        onPort={onPort}
        onRemoteServer={onRemoteServer}
        onPassword={onPassword}
        onClearPassword={onClearPassword}
      />
      <ServerFields server={server} onServer={onServer} />
    </Stack>
  );
};

export { ServerOptionsForm };
