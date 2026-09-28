/* @layer renderer-app @kind logic */
import type { Overrides } from '../SessionBuilder.type';

const omitKey = (overrides: Overrides, key: string): Overrides =>
  Object.fromEntries(Object.entries(overrides).filter(([name]) => name !== key));

export { omitKey };
