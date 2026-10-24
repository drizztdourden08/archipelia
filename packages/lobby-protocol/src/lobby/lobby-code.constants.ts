/* @layer protocol @kind config */

const CODE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const CODE_ALIASES: Record<string, string> = { I: '1', L: '1', O: '0' };
const CODE_LENGTH = 8;

export { CODE_ALIASES, CODE_ALPHABET, CODE_LENGTH };
