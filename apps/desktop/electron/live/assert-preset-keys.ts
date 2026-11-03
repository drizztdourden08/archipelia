/* @layer electron-main @kind logic */
import { setPlayers } from '@archipelia/model';
import type { SessionOverrides } from '../../src/live/live.type';
import { LIVE_TEXT } from './live.constants';
import type { LibraryView } from '@archipelia/sessions/validation';

const assertPresetKeys = ({ players = [] }: SessionOverrides, { installed }: LibraryView): void => {
  for (const { name, game, source } of setPlayers(players)) {
    if (source.kind !== 'preset') continue;
    const schema = installed.find((entry) => entry.game === game)?.schema;
    if (!schema) throw new Error(LIVE_TEXT.notInstalled(game));
    const known = new Set(schema.options.map((option) => option.key));
    const stray = Object.keys(source.overrides).find((key) => !known.has(key));
    if (stray !== undefined) throw new Error(LIVE_TEXT.notAnOption(name, stray));
  }
};

export { assertPresetKeys };
