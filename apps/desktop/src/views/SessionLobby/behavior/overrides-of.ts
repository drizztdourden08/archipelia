/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';
import type { Overrides } from '../SessionLobby.type';

const overridesOf = (player: SessionPlayer): Overrides => (player.source.kind === 'preset' ? player.source.overrides : {});

export { overridesOf };
