/* @layer core @kind logic */
import type { HostTarget } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import { check } from './check-keys';
import { PORT_RANGE, ROOM_KEYS } from './options.constants';
import { readText } from './read-text';
import { readWhole } from './read-whole';

const secureUrl = (value: unknown): string => {
  const text = readText('options.room.baseUrl', value);
  if (!text.startsWith('https://')) throw new Error('options.room.baseUrl must start with https://');
  return text;
};

const readRoom = (value: unknown): HostTarget => {
  if (!isRecord(value)) throw new Error('options.room must be an object');
  const { kind } = value;
  if (kind === 'local') {
    check('options.room', value, ROOM_KEYS.local);
    return { kind, port: readWhole('options.room.port', value.port, PORT_RANGE) };
  }
  if (kind === 'archipelago-gg') {
    check('options.room', value, ROOM_KEYS['archipelago-gg']);
    return value.baseUrl === undefined ? { kind } : { kind, baseUrl: secureUrl(value.baseUrl) };
  }
  if (kind === 'remote') {
    check('options.room', value, ROOM_KEYS.remote);
    return { kind, serverId: readText('options.room.serverId', value.serverId) };
  }
  throw new Error('options.room.kind must be one of local, archipelago-gg, remote');
};

export { readRoom };
