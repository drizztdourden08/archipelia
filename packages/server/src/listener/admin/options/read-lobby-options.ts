/* @layer core @kind logic */
import type { LobbyOptions } from '@archipelia/model';
import { check } from './check-keys';
import { ADMISSIONS, OPTION_KEYS, SLOT_RANGE } from './options.constants';
import { readChoice } from './read-choice';
import { readFlag } from './read-flag';
import { readGenerator } from './read-generator';
import { readRoom } from './read-room';
import { readServerSettings } from './read-server-settings';
import { readWhole } from './read-whole';

const readLobbyOptions = (value: Record<string, unknown> | undefined, base: LobbyOptions): Partial<LobbyOptions> | undefined => {
  if (!value) return undefined;
  check('options', value, OPTION_KEYS);
  return {
    ...(value.admission === undefined ? {} : { admission: readChoice('options.admission', value.admission, ADMISSIONS) }),
    ...(value.allowUnlisted === undefined ? {} : { allowUnlisted: readFlag('options.allowUnlisted', value.allowUnlisted) }),
    ...(value.maxSlots === undefined ? {} : { maxSlots: readWhole('options.maxSlots', value.maxSlots, SLOT_RANGE) }),
    ...(value.room === undefined ? {} : { room: readRoom(value.room) }),
    ...(value.generator === undefined ? {} : { generator: readGenerator(value.generator, base.generator) }),
    ...(value.server === undefined ? {} : { server: readServerSettings(value.server, base.server) }),
  };
};

export { readLobbyOptions };
