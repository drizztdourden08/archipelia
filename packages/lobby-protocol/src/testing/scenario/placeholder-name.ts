/* @layer testing @kind logic */
import { PLACEHOLDER } from './placeholder.constants';

const placeholderName = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const match = PLACEHOLDER.exec(value);
  return match?.[1] ?? null;
};

export { placeholderName };
