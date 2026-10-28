/* @layer renderer-app @kind logic */
import type { InstalledGame } from '@archipelia/model';

const installedOf = (game: string, installed: readonly InstalledGame[]) => installed.find((world) => world.game === game);

export { installedOf };
