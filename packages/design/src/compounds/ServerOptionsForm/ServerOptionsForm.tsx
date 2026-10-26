/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera/primitives';
import { GenerationFields } from './sub-components/GenerationFields';
import { ServerFields } from './sub-components/ServerFields';
import type { ServerOptionsFormProps } from './ServerOptionsForm.type';

const ServerOptionsForm = ({ generator, server, onGenerator, onServer }: ServerOptionsFormProps) => (
  <Stack gap="md">
    <GenerationFields generator={generator} onGenerator={onGenerator} />
    <ServerFields server={server} onServer={onServer} />
  </Stack>
);

export { ServerOptionsForm };
