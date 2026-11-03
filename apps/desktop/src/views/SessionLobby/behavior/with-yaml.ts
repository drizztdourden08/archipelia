/* @layer renderer-app @kind logic */
import type { SetPlayer } from '@archipelia/model';

const withYaml = (player: SetPlayer, fileName: string, yaml: string, game: string): SetPlayer => ({
  ...player, game, source: { kind: 'yaml', fileName, yaml },
});

export { withYaml };
