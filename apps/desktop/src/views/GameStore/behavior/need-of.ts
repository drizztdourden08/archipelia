/* @layer renderer-app @kind logic */
import { decodeInstallFailure } from '@archipelia/model';
import type { InstallFailure } from '@archipelia/model';
import type { CardHandlers, GameRow } from '../GameStore.type';
import { failureWire } from './failure-wire';

const needOf = (row: GameRow, handlers: CardHandlers): InstallFailure | undefined => {
  const wire = failureWire(row, handlers);
  return wire === undefined ? undefined : decodeInstallFailure(wire);
};

export { needOf };
