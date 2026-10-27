/* @layer electron-main @kind logic */
import { ADMISSIONS } from '@archipelia/model';
import type { DirectConnection } from '@archipelia/model';
import { DIRECT_OVERRIDE_KEYS } from '../live.constants';
import { readChoice } from './read-choice';
import { readFlag } from './read-flag';
import { readRecord } from './read-record';

const readDirectOverride = (value: unknown): DirectConnection | null => {
  if (value === null) return null;
  const given = readRecord('direct', value, DIRECT_OVERRIDE_KEYS);
  return { admission: readChoice('direct.admission', given.admission, ADMISSIONS), allowUnlisted: readFlag('direct.allowUnlisted', given.allowUnlisted) };
};

export { readDirectOverride };
