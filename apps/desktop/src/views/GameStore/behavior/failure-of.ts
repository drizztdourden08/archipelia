/* @layer renderer-app @kind logic */
import { failureTextOf } from '@archipelia/model';
import type { CardHandlers, GameRow } from '../GameStore.type';
import { failureWire } from './failure-wire';

const failureOf = (row: GameRow, handlers: CardHandlers): string | undefined => {
  const wire = failureWire(row, handlers);
  return wire === undefined ? undefined : failureTextOf(wire);
};

export { failureOf };
