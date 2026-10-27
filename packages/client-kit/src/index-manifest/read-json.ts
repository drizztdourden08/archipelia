/* @layer client-kit @kind logic */
import type { Failer } from '../errors/create-failer.type';

const readJson = (fail: Failer, source: string): unknown => {
  try {
    return JSON.parse(source);
  } catch {
    return fail('the text is not JSON.');
  }
};

export { readJson };
