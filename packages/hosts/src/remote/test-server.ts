/* @layer core @kind logic */
import type { ServerEntry, ServerTest } from '@archipelia/model';
import type { RemoteCredentials, ServerTestOptions } from './remote.type';
import { connectSsh } from './connect-ssh';
import { ENGINE_AP_VERSION } from './test-server.constants';
import { summarize } from './summarize';
import { parseProbe } from './parse-probe';
import { probeScript } from './probe-script';
import { probeChecks } from './probe-checks';

const refuseUnknownKey = () => false;

const testServer = async (entry: ServerEntry, credentials: RemoteCredentials, options: ServerTestOptions = {}): Promise<ServerTest> => {
  const { onHostKey = refuseUnknownKey, connect = connectSsh, apVersion = ENGINE_AP_VERSION } = options;
  const session = await connect({ entry, credentials, onHostKey }).catch((error: unknown) => (error instanceof Error ? error : new Error(String(error))));
  if (session instanceof Error) return summarize([{ name: 'connect', ok: false, detail: session.message }]);
  try {
    const connected = { name: 'connect' as const, ok: true, detail: `connected to ${entry.host}:${entry.port} as ${entry.auth.username}` };
    const probe = parseProbe((await session.exec(probeScript(entry.apPath, entry.gamePort))).stdout);
    return summarize([connected, ...probeChecks(probe, apVersion, entry.gamePort)]);
  } finally {
    session.end();
  }
};

export { testServer };
