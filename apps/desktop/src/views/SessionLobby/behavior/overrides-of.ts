/* @layer renderer-app @kind logic */
import type { SetPlayer } from '@archipelia/model';
import type { Overrides } from '../SessionLobby.type';

const overridesOf = ({ source }: SetPlayer): Overrides => (source.kind === 'preset' ? source.overrides : {});

export { overridesOf };
