/* @layer renderer-app @kind logic */
import type { CardHandlers, GameRow } from '../GameStore.type';
import type { Busy } from './busy-text.type';
import { removeKey } from './remove-key';

const busyOf = ({ entry, state }: GameRow, { isBusy }: CardHandlers): Busy | undefined => {
  if (isBusy(removeKey(entry.apworld))) return 'removing';
  if (!isBusy(entry.apworld)) return undefined;
  return state === 'update' ? 'updating' : 'adding';
};

export { busyOf };
