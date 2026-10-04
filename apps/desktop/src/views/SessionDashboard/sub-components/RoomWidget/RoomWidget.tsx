/* @layer renderer-app @kind component */
import type { Session } from '@archipelia/model';
import { hostLabel } from '@archipelia/model';
import { EmptyState, Stack, StatRow, Text } from '@drizztdourden08/tessera/primitives';
import type { RoomWidgetProps } from './RoomWidget.type';
import { addressOf } from '../../behavior/address-of';
import { useLiveRoom } from '../../behavior/useLiveRoom';

const passwordText = (session: Session, passwordRequired: boolean) =>
  (session.snapshot.server.passwordRef || passwordRequired ? 'Set' : 'None');

const RoomWidget = ({ session, lines }: RoomWidgetProps) => {
  const { passwordRequired } = useLiveRoom(session, lines);
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
      {files.length === 0 && <EmptyState message="No output files yet." />}
      {files.map((file) => <Text key={file} variant="caption" className="session-panel__mono">{file}</Text>)}
    </Stack>
  );
};

export { RoomWidget };
