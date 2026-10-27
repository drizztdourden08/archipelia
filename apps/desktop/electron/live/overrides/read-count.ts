/* @layer electron-main @kind logic */
import { LIVE_TEXT } from '../live.constants';

const readCount = (name: string, value: unknown, max: number): number => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > max) throw new Error(LIVE_TEXT.badOverride(name));
  return value;
};

export { readCount };
