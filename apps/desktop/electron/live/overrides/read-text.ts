/* @layer electron-main @kind logic */
import { LIVE_TEXT } from '../live.constants';

const readText = (name: string, value: unknown): string => {
  if (typeof value !== 'string') throw new Error(LIVE_TEXT.badOverride(name));
  return value;
};

export { readText };
