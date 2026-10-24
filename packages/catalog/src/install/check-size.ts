/* @layer core @kind logic */
import { stat } from 'node:fs/promises';

const checkSize = async (file: string, expected: number | undefined, what: string): Promise<void> => {
  if (expected === undefined) return;
  const { size } = await stat(file);
  if (size !== expected) throw new Error(`${what}: size is ${size} bytes, the release says ${expected}`);
};

export { checkSize };
