/* @layer core @kind logic */
import type { OptionValue } from '../options.type';
import type { PlayerSource, SessionPlayer } from '../session.type';

const valueText = (value: OptionValue): string => (typeof value === 'string' ? value : JSON.stringify(value));

const sourceText = (source: PlayerSource): string => {
  if (source.kind === 'yaml') return `yaml ${source.fileName}, ${source.yaml.length} characters`;
  const options = Object.entries(source.overrides).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${valueText(value)}`);
  return `preset ${source.presetId || 'default'}${options.length ? ` (${options.join(', ')})` : ''}`;
};

const describePlayer = (player: SessionPlayer): string =>
  `${player.game}, ${sourceText(player.source)}${player.direct ? ', direct seat' : ''}`;

export { describePlayer };
