/* @layer testing @kind logic */
import type { FixtureLine } from './scenario.type';
import { expandLines } from './expand-lines';

const parseFixture = (text: string, name = 'fixture'): FixtureLine[] => {
  const raw = text
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .map((line, index) => {
      try {
        return JSON.parse(line) as Record<string, unknown>;
      } catch {
        throw new Error(`${name} line ${index + 1} is not JSON`);
      }
    });
  return expandLines(raw, name);
};

export { parseFixture };
