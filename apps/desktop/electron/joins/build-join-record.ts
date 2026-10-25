/* @layer electron-main @kind logic */
import { normalizeLobbyCode } from '@drizztdourden08/archipelia-lobby-protocol';
import { sha256Hex } from '@drizztdourden08/archipelia-lobby-protocol/node';
import { newId } from '@drizztdourden08/brock-core/storage';
import type { InstalledGame, SessionPlayer } from '@archipelia/model';
import { resolveValues } from '@archipelia/presets';
import { renderPlayer, renderPresetYaml } from '@archipelia/sessions/players';
import type { JoinRequest } from '../../src/joins/joins.type';
import { joinAddress } from '../../src/lobbies/join-address';
import { BAD_CODE } from '../lobbies/join/join.constants';
import { DISPLAY_NAME_LIMIT, SLOT_NAME_LIMIT, TEXT } from './joins.constants';
import type { JoinRecord, RecordDeps } from './joins.type';
import { worldOf } from './world-of';

const within = (text: string, limit: number) => text.length >= 1 && text.length <= limit;

const yamlOf = (request: JoinRequest, game: InstalledGame, deps: RecordDeps): Promise<string> => {
  const { source } = request;
  const player: SessionPlayer = { slot: 1, name: request.slotName.trim(), game: game.game, source: { kind: 'preset', presetId: '', overrides: {} } };
  if (source.kind === 'yaml') return renderPlayer({ ...player, source }, { presets: deps.presets, schemaOf: () => Promise.resolve(game.schema) });
  if (source.presetId === '') return Promise.resolve(renderPresetYaml(player, resolveValues(game.schema)));
  return renderPlayer({ ...player, source: { kind: 'preset', presetId: source.presetId, overrides: {} } }, { presets: deps.presets, schemaOf: () => Promise.resolve(game.schema) });
};

const checkRequest = (request: JoinRequest): string => {
  const parsed = joinAddress(request.address);
  if ('problem' in parsed) throw new Error(parsed.problem);
  if (!within(request.displayName.trim(), DISPLAY_NAME_LIMIT)) throw new Error(TEXT.badDisplay);
  if (!within(request.slotName.trim(), SLOT_NAME_LIMIT)) throw new Error(TEXT.badName);
  const code = normalizeLobbyCode(request.code);
  if (!code) throw new Error(BAD_CODE);
  return code;
};

const buildJoinRecord = async (request: JoinRequest, deps: RecordDeps): Promise<JoinRecord> => {
  const code = checkRequest(request);
  const game = (await deps.installed()).find((entry) => entry.game === request.game);
  if (!game) throw new Error(TEXT.noGame);
  const text = await yamlOf(request, game, deps);
  const bytes = new TextEncoder().encode(text);
  const world = await worldOf(game, deps);
  return {
    id: newId(), address: request.address.trim(), code, displayName: request.displayName.trim(), slotName: request.slotName.trim(), game: game.game,
    state: 'connecting', yaml: { text, sha256: sha256Hex(bytes), size: bytes.length }, createdAt: deps.now, updatedAt: deps.now,
    ...(world ? { world } : {}),
  };
};

export { buildJoinRecord };
