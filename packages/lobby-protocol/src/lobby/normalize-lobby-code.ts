/* @layer protocol @kind logic */
import { CODE_ALIASES, CODE_ALPHABET, CODE_LENGTH } from './lobby-code.constants';

const normalizeLobbyCode = (input: string): string | null => {
  const upper = input.trim().toUpperCase();
  const plain = upper.length === CODE_LENGTH + 1 && upper[4] === '-' ? upper.slice(0, 4) + upper.slice(5) : upper;
  if (plain.length !== CODE_LENGTH) return null;
  const mapped = [...plain].map((char) => CODE_ALIASES[char] ?? char);
  return mapped.every((char) => CODE_ALPHABET.includes(char)) ? mapped.join('') : null;
};

export { normalizeLobbyCode };
