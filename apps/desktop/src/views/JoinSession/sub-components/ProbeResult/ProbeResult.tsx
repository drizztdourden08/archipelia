/* @layer renderer-app @kind component */
import { Callout, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { TEXT } from '../../JoinSession.constants';
import type { ProbeResultProps } from '../../JoinSession.type';
import { probeProblem } from '../../behavior/probe-problem';

const ProbeResult = ({ probe, localAp }: ProbeResultProps) => {
  const problem = probeProblem(probe, localAp);
  if (!probe.ok) return <Callout tone="danger">{probe.message}</Callout>;
  const games = probe.games && probe.games.length > 0 ? ` · ${probe.games.join(', ')}` : '';
  return (
    <Stack gap="xs">
      <Callout tone={problem === null ? 'success' : 'warning'}>
        {`${probe.name ?? 'This session'} · Archipelago ${probe.ap ?? '?'} · ${probe.joinable ? TEXT.joinable : TEXT.notJoinable}${games}`}
      </Callout>
      {problem !== null && <Text variant="caption">{problem}</Text>}
    </Stack>
  );
};

export { ProbeResult };
