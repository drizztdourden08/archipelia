/* @layer renderer-app @kind logic */
import type { GameSchema, OptionValue } from '@archipelia/model';
import { renderPresetYaml } from '@archipelia/sessions/players';
import { resolveValues } from '@archipelia/presets';
import { PLAYER_NAME } from '../PresetEditor.constants';

const exportPlayerYaml = (schema: GameSchema, values: Record<string, OptionValue>) =>
  renderPresetYaml(
    { slot: 1, name: PLAYER_NAME, game: schema.game, source: { kind: 'preset', presetId: '', overrides: {} } },
    resolveValues(schema, values),
  );

export { exportPlayerYaml };
