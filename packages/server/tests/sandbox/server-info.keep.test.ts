/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { connectWebSocket } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import { startListener } from '../../src/listener/start-listener';
import type { SandboxMode } from '../../src/sandbox/sandbox.type';
import { admin, startService } from '../lobby/security-kit';

const welcomeOf = async (sandbox?: SandboxMode) => {
  const kit = await startService();
  const listener = await startListener({ service: kit.service, host: '127.0.0.1', port: 0, serverVersion: 't', admin, ...(sandbox ? { sandbox } : {}) });
  const socket = await connectWebSocket(`ws://127.0.0.1:${listener.port}/archipelia/admin`);
  const welcome = new Promise<Record<string, unknown>>((resolve) => {
    socket.listen((event) => {
      if (event.kind === 'text') resolve(JSON.parse(event.text) as Record<string, unknown>);
    });
  });
  socket.send(JSON.stringify({ type: 'admin.hello', seq: 1, token: 't' }));
  const message = await welcome;
  socket.close();
  await listener.stop();
  await kit.stop();
  return message;
};

describe('server.info', () => {
  test('reports the sandbox the server has', async () => {
    expect(await welcomeOf('bwrap')).toMatchObject({ type: 'admin.welcome', server: { sandbox: 'bwrap' } });
  });

  test('reports no sandbox when none was found', async () => {
    expect(await welcomeOf()).toMatchObject({ type: 'admin.welcome', server: { sandbox: 'none' } });
  });
});
