/* @layer core @kind logic */
import { settingOf } from './setting-of';
import { GAME_KEY, PLAYER_LINE, SINGLE_PLAYER_NAME, VERSION_LINE } from './spoiler.constants';
import type { SpoilerHead, SpoilerKnown, SpoilerPlayer, SpoilerSetting } from './spoiler.type';

type OpenPlayer = { slot: number; name: string; options: SpoilerSetting[] };

type HeadState = { settings: SpoilerSetting[]; open: OpenPlayer[]; inPlayer: boolean };

const playerOf = ({ slot, name, options }: OpenPlayer): SpoilerPlayer => ({
  slot,
  name,
  game: options.find((option) => option.key === GAME_KEY)?.value ?? '',
  options: options.filter((option) => option.key !== GAME_KEY),
});

const addSetting = (state: HeadState, setting: SpoilerSetting, soloName: string) => {
  if (!state.inPlayer && setting.key === GAME_KEY) {
    state.open.push({ slot: 1, name: soloName, options: [] });
    state.inPlayer = true;
  }
  const current = state.open[state.open.length - 1];
  if (state.inPlayer && current) current.options.push(setting);
  else state.settings.push(setting);
};

const stepLine = (state: HeadState, line: string, soloName: string) => {
  const player = PLAYER_LINE.exec(line);
  if (line.trim() === '') state.inPlayer = false;
  else if (player) {
    state.open.push({ slot: Number(player[1]), name: (player[2] ?? '').trim(), options: [] });
    state.inPlayer = true;
  } else {
    const setting = settingOf(line);
    if (setting) addSetting(state, setting, soloName);
  }
};

const parseHead = (head: readonly string[], known: SpoilerKnown): SpoilerHead => {
  const versionMatch = VERSION_LINE.exec(head[0] ?? '');
  const state: HeadState = { settings: [], open: [], inPlayer: false };
  const soloName = known.players?.[0] ?? SINGLE_PLAYER_NAME;
  head.slice(1).forEach((line) => stepLine(state, line, soloName));
  return { version: versionMatch?.[1] ?? '', seed: versionMatch?.[2] ?? '', settings: state.settings, players: state.open.map(playerOf) };
};

export { parseHead };
