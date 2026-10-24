/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { LOBBY_PATH } from '../src';
import { connectWebSocket, createFakeClient, createFakeServer, createMemoryPair, loadScenario } from '../src/testing';
import type { TransportEvent } from '../src/testing';
import { encodeFrame } from '../src/node/transport/encode-frame';
import { parseFrame } from '../src/node/transport/parse-frame';

const playOverSocket = async (name: string) => {
  const scenario = loadScenario(name);
  const server = createFakeServer({ scenario });
  const listener = await server.listen();
  try {
    const client = createFakeClient({ scenario, connect: () => connectWebSocket(listener.url) });
    const [clientResult, serverResult] = await Promise.all([client.play(), server.done]);
    return { client: clientResult.failure, server: serverResult.failure };
  } finally {
    await listener.stop();
  }
};

describe('real WebSocket transport', () => {
  test.each(['approval-join', 'upload-resume', 'version-mismatch', 'wrong-code-rate-limit', 'bad-message-binary'])(
    '%s plays over ws://',
    async (name) => {
      expect(await playOverSocket(name)).toEqual({ client: undefined, server: undefined });
    },
  );

  test('the listener serves the lobby path only', async () => {
    const server = createFakeServer({ scenario: loadScenario('lobby-info'), timeoutMs: 200 });
    const listener = await server.listen();
    try {
      expect(listener.url.endsWith(LOBBY_PATH)).toBe(true);
      await expect(connectWebSocket(listener.url.replace(LOBBY_PATH, '/elsewhere'))).rejects.toThrow();
    } finally {
      await listener.stop();
    }
  });
});

describe('frames', () => {
  const masked = (payload: Buffer, opcode = 1): Buffer => {
    const mask = Buffer.from([1, 2, 3, 4]);
    const body = Buffer.from(payload.map((byte, index) => byte ^ (mask[index % 4] ?? 0)));
    const header = payload.length < 126 ? Buffer.from([0x80 | opcode, 0x80 | payload.length]) : Buffer.alloc(0);
    return Buffer.concat([header, mask, body]);
  };

  test('a masked client frame parses back to its payload', () => {
    const parsed = parseFrame(masked(Buffer.from('hello')));
    expect(parsed?.frame.payload.toString('utf8')).toBe('hello');
    expect(parsed?.frame.opcode).toBe(1);
  });

  test('a server frame with a 16 bit and a 64 bit length survives a round trip', () => {
    for (const size of [10, 200, 70000]) {
      const payload = Buffer.alloc(size, 7);
      const parsed = parseFrame(encodeFrame(1, payload));
      expect(parsed?.frame.payload.length).toBe(size);
      expect(parsed?.consumed).toBeGreaterThan(size);
    }
  });

  test('a partial frame waits for more bytes', () => {
    expect(parseFrame(encodeFrame(1, Buffer.from('abcdef')).subarray(0, 4))).toBeNull();
  });
});

describe('memory transport', () => {
  test('messages arrive in order and then the close with its code', async () => {
    const [left, right] = createMemoryPair();
    const seen: TransportEvent[] = [];
    right.listen((event) => seen.push(event));
    left.send('one');
    left.send('two');
    left.close(4403);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    expect(seen).toEqual([
      { kind: 'text', text: 'one' },
      { kind: 'text', text: 'two' },
      { kind: 'close', code: 4403 },
    ]);
  });
});
