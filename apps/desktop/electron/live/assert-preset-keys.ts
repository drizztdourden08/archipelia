/* @layer electron-main @kind logic */
import type { SessionOverrides } from '../../src/live/live.type';
import { LIVE_TEXT } from './live.constants';
import type { LibraryView } from './live.type';

const assertPresetKeys = ({ players = [] }: SessionOverrides, { installed }: LibraryView): void => {
  for (const { name, game = '', source } of players) {
    if (source?.kind !== 'preset') continue;
    const schema = installed.find((entry) => entry.game === game)?.schema;
    if (!schema) throw new Error(LIVE_TEXT.notInstalled(game));
    const known = new Set(schema.options.map((option) => option.key));
    const stray = Object.keys(source.overrides).find((key) => !known.has(key));
    if (stray !== undefined) throw new Error(LIVE_TEXT.notAnOption(name, stray));
  }
};

export { assertPresetKeys };
