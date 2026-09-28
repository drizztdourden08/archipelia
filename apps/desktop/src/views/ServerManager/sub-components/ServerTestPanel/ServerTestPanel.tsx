/* @layer renderer-app @kind component */
import type { ServerCheck } from '@archipelia/model';
import { Badge, Button, Stack, StatRow, Text } from '@drizztdourden08/tessera/primitives';
import type { ServerTestPanelProps } from './ServerTestPanel.type';

const verdictOf = (check: ServerCheck) => {
  if (check.ok) return 'ok';
  return check.advisory ? 'advice' : 'failed';
};

const ServerTestPanel = ({ test, pinned, busy, onTrust }: ServerTestPanelProps) => (
  <Stack gap="xs">
    <StatRow label="Host key" value={pinned ?? 'not pinned yet'} />
    {test?.hostKey && (
      <Stack gap="xs">
        <Text variant="body">First connection. Check this fingerprint with the host owner, then trust it:</Text>
        <Text variant="caption">{test.hostKey}</Text>
        <Button variant="primary" disabled={busy} onClick={() => onTrust(test.hostKey ?? '')}>Trust this key</Button>
      </Stack>
    )}
    {test && (
      <Stack gap="xs">
        <Badge variant={test.ok ? 'success' : 'danger'}>{test.ok ? 'Ready' : 'Not ready'}</Badge>
        <Text variant="body">{test.message}</Text>
        {(test.checks ?? []).map((check) => (
          <StatRow key={check.name} label={check.name} value={`${verdictOf(check)}: ${check.detail}`} />
        ))}
      </Stack>
    )}
  </Stack>
);

export { ServerTestPanel };
