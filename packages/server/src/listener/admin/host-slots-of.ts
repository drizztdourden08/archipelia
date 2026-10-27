/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { HostSlotInput } from '../../lobby/lobby-service.type';
import { readOrigin } from './options/read-origin';

const isHostSlot = (value: unknown): value is Record<'name' | 'game' | 'yaml' | 'worldVersion', string> & { origin?: unknown } =>
  isRecord(value) && ['name', 'game', 'yaml', 'worldVersion'].every((key) => typeof value[key] === 'string');

const hostSlotsOf = (values: unknown[]): HostSlotInput[] => {
  if (!values.every(isHostSlot)) throw new Error('each host slot needs name, game, yaml and worldVersion');
  return values.map(({ name, game, yaml, worldVersion, origin }) => {
    const read = readOrigin(`slot ${name} origin`, origin);
    return { name, game, yaml, worldVersion, ...(read ? { origin: read } : {}) };
  });
};

export { hostSlotsOf };
