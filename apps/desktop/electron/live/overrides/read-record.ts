/* @layer electron-main @kind logic */
import { isRecord } from '@archipelia/model';
import { LIVE_TEXT, OVERRIDES_ROOT } from '../live.constants';

const readRecord = (name: string, value: unknown, allowed: readonly string[]): Record<string, unknown> => {
  if (!isRecord(value)) throw new Error(LIVE_TEXT.badOverride(name));
  const stray = Object.keys(value).find((key) => !allowed.includes(key));
  if (stray !== undefined) throw new Error(LIVE_TEXT.notAnOverride(name === OVERRIDES_ROOT ? stray : `${name}.${stray}`));
  return value;
};

export { readRecord };
