/* @layer core @kind logic */
import type { SlotOrigin } from '@archipelia/model';
import { SLOT_ORIGINS } from './options.constants';

const readOrigin = (name: string, value: unknown): SlotOrigin | undefined => {
  if (value === undefined) return undefined;
  const origin = SLOT_ORIGINS.find((entry) => entry === value);
  if (!origin) throw new Error(`${name} must be ${SLOT_ORIGINS.join(' or ')}`);
  return origin;
};

export { readOrigin };
