/* @layer renderer-app @kind component */
import type { Session } from '@archipelia/model';
import { Stack, StatRow, Text } from '@drizztdourden08/tessera/primitives';
import type { RoomWidgetProps } from './RoomWidget.type';
import { hostLabel } from '../../behavior/host-label';
import { addressOf } from '../../behavior/address-of';

const passwordText = (session: Session, passwordRequired: boolean) =>
  (session.snapshot.server.passwordRef || passwordRequired ? 'Set' : 'None');

const RoomWidget = ({ session, passwordRequired }: RoomWidgetProps) => {
  const files = session.output?.files ?? [];
  return (
    <Stack gap="sm" className="session-panel">
      <StatRow label="Host" value={hostLabel(session.snapshot.host)} />
      <StatRow label="Address" value={addressOf(session.endpoint) ?? 'not hosting'} mono />
      {session.endpoint?.roomUrl && <StatRow label="Room page" value={session.endpoint.roomUrl} mono />}
      <StatRow label="Password" value={passwordText(session, passwordRequired)} />
      {session.seed && <StatRow label="Seed" value={session.seed} mono />}
      {session.output && <StatRow label="Output" value={session.output.zip} mono />}
      <Text variant="label">{`Files (${files.length})`}</Text>
      {files.length === 0 && <Text variant="caption">No output files yet.</Text>}
      {files.map((file) => <Text key={file} variant="caption" className="session-panel__mono">{file}</Text>)}
    </Stack>
  );
};

export { RoomWidget };
