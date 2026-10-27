/* @layer electron-main @kind logic */
import { LIVE_TEXT } from '../live.constants';

const readFlag = (name: string, value: unknown): boolean => {
  if (typeof value !== 'boolean') throw new Error(LIVE_TEXT.badOverride(name));
  return value;
};

export { readFlag };
