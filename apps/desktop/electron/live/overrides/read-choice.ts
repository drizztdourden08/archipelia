/* @layer electron-main @kind logic */
import { LIVE_TEXT } from '../live.constants';

const readChoice = <T extends string | number>(name: string, value: unknown, choices: readonly T[]): T => {
  const found = choices.find((choice) => choice === value);
  if (found === undefined) throw new Error(LIVE_TEXT.badOverride(name));
  return found;
};

export { readChoice };
