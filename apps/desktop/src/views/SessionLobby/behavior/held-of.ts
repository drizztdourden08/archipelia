/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';

const heldOf = ({ slot, name }: SessionPlayer): SessionPlayer => ({ slot, name, direct: true });

export { heldOf };
