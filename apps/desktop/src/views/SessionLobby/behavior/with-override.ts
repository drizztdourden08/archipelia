/* @layer renderer-app @kind logic */
import type { OptionValue, SessionPlayer } from '@archipelia/model';
import { omitKey } from './omit-key';

const sameValue = (a: OptionValue | undefined, b: OptionValue | undefined) => JSON.stringify(a) === JSON.stringify(b);

const withOverride = (player: SessionPlayer, key: string, value: OptionValue, presetValue: OptionValue | undefined) => {
  if (player.source.kind !== 'preset') return player;
  const rest = omitKey(player.source.overrides, key);
  const overrides = sameValue(value, presetValue) ? rest : { ...rest, [key]: value };
  return { ...player, source: { ...player.source, overrides } };
};

export { withOverride };
