/* @layer core @kind logic */
import type { HostTarget, LobbyRoom, LobbyRoomFile, Session } from '@archipelia/model';

const tlsOf = (target: HostTarget): LobbyRoom['tls'] => (target.kind === 'local' ? 'no' : 'auto');

const roomOf = (session: Session, passwordRef: string | undefined, files: LobbyRoomFile[]): LobbyRoom => {
  const { endpoint, output } = session;
  if (!endpoint || !output) throw new Error('the session has no room');
  return {
    seed: session.seed ?? session.id,
    zip: output.zip,
    host: endpoint.host,
    port: endpoint.port,
    tls: tlsOf(session.snapshot.host),
    ...(endpoint.roomUrl ? { roomUrl: endpoint.roomUrl } : {}),
    ...(passwordRef ? { passwordRef } : {}),
    files,
    state: 'hosting',
  };
};

export { roomOf };
