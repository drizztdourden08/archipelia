/* @layer server @kind logic */
import type { Choice } from './choose.type';

const choose = <T>({ key, env, file, fallback, read }: Choice<T>): T => {
  if (env !== undefined && env !== '') return read(`${key} (environment)`, env);
  if (file !== undefined) return read(key, file);
  return fallback;
};

export { choose };
