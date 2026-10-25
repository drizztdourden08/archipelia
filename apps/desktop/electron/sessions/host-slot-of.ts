/* @layer electron-main @kind logic */
import type { InstalledGame, SessionPlayer } from '@archipelia/model';
import type { PlayerSources } from '@archipelia/sessions/players';
import { renderPlayer } from '@archipelia/sessions/players';
import type { HostPlayerSlot } from '../../src/lobbies/lobbies.type';
import { TEXT } from './sessions.constants';

const hostSlotOf = (installed: () => Promise<InstalledGame[]>, presets: PlayerSources['presets']) => async (player: SessionPlayer): Promise<HostPlayerSlot> => {
  const game = (await installed()).find((entry) => entry.game === player.game);
  if (!game) throw new Error(TEXT.notInstalled(player.game));
  const yaml = await renderPlayer(player, { presets, schemaOf: () => Promise.resolve(game.schema) });
  return { name: player.name, game: game.game, yaml, worldVersion: game.schema.worldVersion };
};

export { hostSlotOf };
