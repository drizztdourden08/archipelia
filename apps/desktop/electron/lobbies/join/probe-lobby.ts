/* @layer electron-main @kind logic */
import { normalizeLobbyCode, PROTOCOL_NAME, SUPPORTED_PROTOCOL_VERSIONS } from '@drizztdourden08/archipelia-lobby-protocol';
import { joinAddress } from '../../../src/lobbies/join-address';
import type { LobbyProbe } from '../../../src/lobbies/lobbies.type';
import { openLobbyTransport } from './open-lobby-transport';
import { BAD_CODE, CLOSED_BEFORE_ANSWER, NO_ANSWER, PROBE_TIMEOUT_MS, PROBE_UNREACHABLE } from './join.constants';
import { readReply } from './read-reply';

const probeLobby = async (address: string, code: string): Promise<LobbyProbe> => {
  const parsed = joinAddress(address);
  if ('problem' in parsed) return { ok: false, message: parsed.problem };
  const normal = normalizeLobbyCode(code);
  if (!normal) return { ok: false, message: BAD_CODE };
  try {
    const transport = await openLobbyTransport(parsed.target);
    return await new Promise<LobbyProbe>((resolve) => {
      const done = (probe: LobbyProbe) => {
        clearTimeout(timer);
        resolve(probe);
        transport.close();
      };
      const timer = setTimeout(() => done({ ok: false, message: NO_ANSWER }), PROBE_TIMEOUT_MS);
      transport.listen((event) => {
        if (event.kind === 'close') done({ ok: false, message: CLOSED_BEFORE_ANSWER });
        if (event.kind !== 'text') return;
        const answer = readReply(event.text);
        if (answer) done(answer);
      });
      transport.send(JSON.stringify({
        type: 'lobby.info', seq: 1, protocol: { name: PROTOCOL_NAME, versions: SUPPORTED_PROTOCOL_VERSIONS }, lobby: { code: normal },
      }));
    });
  } catch (error) {
    return { ok: false, message: error instanceof Error && error.message !== '' ? error.message : PROBE_UNREACHABLE };
  }
};

export { probeLobby };
