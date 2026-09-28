/* @layer core @kind logic */
import type { OptionValue, SessionPlayer } from '@archipelia/model';
import { stringify } from 'yaml';
import { DESCRIPTION } from './player-yaml.constants';

const renderPresetYaml = (player: SessionPlayer, values: Record<string, OptionValue>) =>
  stringify({ name: player.name, game: player.game, description: DESCRIPTION, [player.game]: values });

export { renderPresetYaml };
