/* @layer core @kind logic */
import { randomInt } from 'node:crypto';
import { CODE_ALPHABET, CODE_LENGTH } from '@drizztdourden08/archipelia-lobby-protocol';

const newCode = (): string => Array.from({ length: CODE_LENGTH }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join('');

export { newCode };
