/* @layer tests @kind test */
import { readFile } from 'node:fs/promises';
import { installFromFile, installOfficial } from '@archipelia/catalog';
import { ENGINE_DIR, relicFiles } from './support/e2e-inputs';
import { defineMultiworld } from './support/multiworld-rig';
import { sohPlayer } from './support/soh-world';

defineMultiworld({
  title: 'Ship of Harkinian and an official world, headless',
  port: 38291,
  setup: async (ctx) => {
    const official = await installOfficial({ engineDir: ENGINE_DIR, files: ctx.games, apworld: 'timespinner' });
    const preset = await ctx.presets.create({ game: official.game, name: 'Defaults' });
    return [
      await sohPlayer(ctx, 1, 'Link'),
      { slot: 2, name: 'Lunais', game: official.game, source: { kind: 'preset', presetId: preset.id, overrides: {} } },
    ];
  },
});

defineMultiworld({
  title: 'Relic of the Past and Ship of Harkinian, headless',
  port: 38290,
  setup: async (ctx) => {
    const relic = await relicFiles();
    const installed = await installFromFile({ engineDir: ENGINE_DIR, files: ctx.games, path: relic.apworld });
    const yaml = await readFile(relic.yamlPath, 'utf8');
    return [
      { slot: 1, name: 'Relic', game: installed.game, source: { kind: 'yaml', fileName: 'Relic.yaml', yaml } },
      await sohPlayer(ctx, 2, 'Link'),
    ];
  },
});
