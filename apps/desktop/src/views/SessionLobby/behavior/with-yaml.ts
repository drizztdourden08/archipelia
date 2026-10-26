/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';

const withYaml = (player: SessionPlayer, fileName: string, yaml: string, game: string): SessionPlayer => ({
  ...player, game, source: { kind: 'yaml', fileName, yaml },
});

export { withYaml };
