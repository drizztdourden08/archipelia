/* @layer core @kind config */

const ERROR_LINE = /(Error|Exception)(:|\b)/;

const NOISE = /EOFError: EOF when reading a line|Exception ignored in atexit callback/;

const NO_OUTPUT = 'The generator stopped without saying why.';

export { ERROR_LINE, NOISE, NO_OUTPUT };
