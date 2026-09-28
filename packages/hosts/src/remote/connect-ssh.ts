/* @layer core @kind logic */
import { Client } from 'ssh2';
import type { SshConnect } from './remote.type';
import { authConfig } from './auth-config';
import { createHostVerifier } from './create-host-verifier';
import { createClientSession } from './ssh-client-session';
import { KEEPALIVE_MS, READY_TIMEOUT_MS } from './ssh-connect.constants';

const connectSsh: SshConnect = ({ entry, credentials, onHostKey }) =>
  new Promise((resolve, reject) => {
    const auth = authConfig(entry.auth, credentials);
    const pin = createHostVerifier(entry.hostKeySha256, onHostKey);
    const client = new Client();
    let open = false;
    client.on('ready', () => {
      open = true;
      resolve(createClientSession(client, () => open));
    });
    client.on('error', (error) => {
      if (!open) reject(new Error(pin.refusal() ?? `ssh ${entry.host}:${entry.port}: ${error.message}`));
    });
    client.on('close', () => { open = false; });
    client.connect({
      host: entry.host, port: entry.port, ...auth, hostVerifier: pin.verify, readyTimeout: READY_TIMEOUT_MS, keepaliveInterval: KEEPALIVE_MS,
    });
  });

export { connectSsh };
