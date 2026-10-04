/* @layer renderer-app @kind component */
import { Card, Divider, SectionHeader, Stack } from '@drizztdourden08/tessera/primitives';
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
    <Card>
      <Stack gap="md">
        <SectionHeader title="Generation and server" subtitle="How the seed is made and how the room runs." />
        <GenerationFields generator={generator} onGenerator={onGenerator} />
        <Divider />
        <HostFields host={host} serverOptions={serverOptions} onHostKind={onHostKind} onPort={onPort} onRemoteServer={onRemoteServer} />
        <Divider />
        <ServerFields
          server={server}
          password={password}
          hasPassword={hasPassword}
          onServer={onServer}
          onPassword={onPassword}
          onClearPassword={onClearPassword}
        />
      </Stack>
    </Card>
  );
};

export { ServerOptionsForm };
