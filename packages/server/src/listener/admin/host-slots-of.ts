/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { HostSlotInput } from '../../lobby/lobby-service.type';

const isHostSlot = (value: unknown): value is HostSlotInput =>
  isRecord(value) && ['name', 'game', 'yaml', 'worldVersion'].every((key) => typeof value[key] === 'string');

const hostSlotsOf = (values: unknown[]): HostSlotInput[] => {
  if (values.length === 0 || !values.every(isHostSlot)) throw new Error('each host slot needs name, game, yaml and worldVersion');
  return values;
};

export { hostSlotsOf };
