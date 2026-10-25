/* @layer renderer-app @kind component */
import { Callout, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { TEXT } from '../../JoinLobby.constants';
import type { ProbeResultProps } from '../../JoinLobby.type';

const ProbeResult = ({ probe }: ProbeResultProps) => {
  if (!probe.ok) return <Callout tone="danger">{probe.message}</Callout>;
  const games = probe.games && probe.games.length > 0 ? ` · ${probe.games.join(', ')}` : '';
  return (
    <Stack gap="sm">
      <Callout tone="success">
        {`${probe.name ?? 'This lobby'} · Archipelago ${probe.ap ?? '?'} · ${probe.joinable ? TEXT.joinable : TEXT.notJoinable}${games}`}
      </Callout>
      <Text variant="caption">{TEXT.next}</Text>
    </Stack>
  );
};

export { ProbeResult };
