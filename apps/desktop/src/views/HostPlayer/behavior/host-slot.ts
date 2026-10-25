/* @layer renderer-app @kind logic */
import type { GamePreset, InstalledGame } from '@archipelia/model';
import { resolveValues } from '@archipelia/presets';
import { renderPresetYaml } from '@archipelia/sessions/players';
import type { HostPlayerSlot } from '../../../lobbies/lobbies.type';

const hostSlot = (name: string, game: InstalledGame, preset: GamePreset | undefined): HostPlayerSlot => ({
  name,
  game: game.schema.game,
  worldVersion: game.schema.worldVersion,
  yaml: renderPresetYaml(
    { slot: 1, name, game: game.schema.game, source: { kind: 'preset', presetId: preset?.id ?? '', overrides: {} } },
    resolveValues(game.schema, preset?.values ?? {}),
  ),
});

export { hostSlot };
