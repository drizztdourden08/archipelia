/* @layer renderer-app @kind logic */
import type { TagLook } from '@drizztdourden08/tessera/primitives';
import type { LobbySeatTone } from '../LobbySeat.type';

const tagLookOf = (tone: LobbySeatTone): TagLook => (tone === 'neutral' ? { color: 'neutral' } : { variant: 'urgency', color: tone });

export { tagLookOf };
