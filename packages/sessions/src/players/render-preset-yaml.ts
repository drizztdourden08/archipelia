/* @layer core @kind logic */
import type { OptionValue, HostedPlayer } from '@archipelia/model';
import { stringify } from 'yaml';
import { DESCRIPTION } from './player-yaml.constants';

const renderPresetYaml = (player: HostedPlayer, values: Record<string, OptionValue>) =>
  stringify({ name: player.name, game: player.game, description: DESCRIPTION, [player.game]: values });

export { renderPresetYaml };
