/* @layer electron-main @kind logic */
import { zipSync } from 'fflate';
import type { Session } from '@archipelia/model';
import type { CoreLobbyRun } from '@archipelia/server';
import { REVIEW_HOST, REVIEW_SEED, REVIEW_ZIP } from './review.constants';

const text = new TextEncoder();

const fakeLobbyRun: CoreLobbyRun = async (template, lobby, { output, report }) => {
  const id = `review-${lobby.lobbyId}`;
  const files: Record<string, Uint8Array> = { 'AP_REVIEW.archipelago': new Uint8Array([1, 2, 3]) };
  for (const [index, player] of template.players.entries()) files[`AP_REVIEW_P${index + 1}_${player.name}.apreview`] = text.encode(`seed for ${player.name}\n`);
  await output.writeBytes(`${id}/output/${REVIEW_ZIP}`, zipSync(files));
  const base: Session = { id, snapshot: template, status: 'generating', createdAt: Date.now(), lobbyId: lobby.lobbyId, worlds: lobby.worlds };
  report({ type: 'session', session: { ...base, status: 'starting' } });
  return {
    ...base, status: 'hosting', seed: REVIEW_SEED, output: { zip: REVIEW_ZIP, files: [], generateLog: '' },
    endpoint: { host: REVIEW_HOST, port: template.host.kind === 'local' ? template.host.port : 0 },
  };
};

export { fakeLobbyRun };
