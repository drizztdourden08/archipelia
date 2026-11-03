/* @layer renderer-app @kind logic */
import type { OptionValue, SetPlayer } from '@archipelia/model';
import { omitKey } from './omit-key';

const sameValue = (a: OptionValue | undefined, b: OptionValue | undefined) => JSON.stringify(a) === JSON.stringify(b);

const withOverride = (player: SetPlayer, key: string, value: OptionValue, presetValue: OptionValue | undefined): SetPlayer => {
  if (player.source.kind !== 'preset') return player;
  const rest = omitKey(player.source.overrides, key);
  const overrides = sameValue(value, presetValue) ? rest : { ...rest, [key]: value };
  return { ...player, source: { ...player.source, overrides } };
};

export { withOverride };
