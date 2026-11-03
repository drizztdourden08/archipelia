/* @layer renderer-app @kind logic */
import type { PlayerView } from '@archipelia/sessions/live-room';

const progressOf = ({ checked, total }: PlayerView) => (checked !== null && total ? { value: checked, max: total } : null);

export { progressOf };
