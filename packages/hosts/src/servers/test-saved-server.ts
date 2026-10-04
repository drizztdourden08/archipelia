/* @layer core @kind logic */
import type { ServerEntry } from '@archipelia/model';
import { testServer } from '../remote/test-server';
import { credentialsOf } from './credentials-of';
import type { SecretReader, ServerSaver, ServerTestResult } from './servers.type';

const testSavedServer = async (entry: ServerEntry, secrets: SecretReader, servers: ServerSaver): Promise<ServerTestResult> => {
  let offered: string | undefined;
  const onHostKey = (sha: string) => { offered = sha; return false; };
  const result = await testServer(entry, await credentialsOf(entry, secrets), { onHostKey });
  await servers.save({ ...entry, lastTest: result });
  return offered && !entry.hostKeySha256 ? { ...result, hostKey: offered } : result;
};

export { testSavedServer };
