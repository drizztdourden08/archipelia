/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { SessionMetaProps } from './SessionMeta.type';

const SessionMeta = ({ where, players, last }: SessionMetaProps) => (
  <Stack gap="xs">
    <Text variant="caption">{`${where} · ${players}`}</Text>
    <Text variant="caption" tone="dim">{last}</Text>
  </Stack>
);

export { SessionMeta };
