/* @layer core @kind logic */
import { posix } from 'node:path';
import { SAFE_ID } from './remote-layout.constants';

const remoteLayout = (apPath: string, sessionId: string, zipName: string) => {
  if (!SAFE_ID.test(sessionId)) throw new Error(`the session id "${sessionId}" cannot be used as a remote folder name`);
  if (!posix.isAbsolute(apPath)) throw new Error(`the Archipelago folder "${apPath}" must be an absolute path`);
  const dir = posix.join(apPath, 'archipelia', 'sessions', sessionId);
  return {
    dir,
    zip: posix.join(dir, posix.basename(zipName)),
    settings: posix.join(dir, 'host.yaml'),
    multiServer: posix.join(apPath, 'MultiServer.py'),
    unit: `archipelia-${sessionId}`,
  };
};

export { remoteLayout };
