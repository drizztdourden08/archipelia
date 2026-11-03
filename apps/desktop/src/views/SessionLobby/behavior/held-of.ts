/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';

const heldOf = ({ slot }: SessionPlayer): SessionPlayer => ({ kind: 'direct', slot });

export { heldOf };
