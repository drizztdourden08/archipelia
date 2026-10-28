/* @layer renderer-app @kind logic */
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import type { GameDetailsVersion } from '../../../GameDetails.type';

const selectOptionOf = ({ value, label, reason }: GameDetailsVersion): SelectOption => ({ value, label, disabled: reason ?? false });

export { selectOptionOf };
