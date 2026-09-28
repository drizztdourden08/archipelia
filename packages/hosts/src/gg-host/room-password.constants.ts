/* @layer core @kind config */

const PASSWORD_SET = /Set option password to /;

const CLEARING_WORDS = new Set(['null', 'none', '""', "''"]);

export { CLEARING_WORDS, PASSWORD_SET };
