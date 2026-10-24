/* @layer client-kit @kind config */

const MAX_SLOT_NAME_LENGTH = 16;

const DEFAULT_PRE_ROLLED_KEY = 'pre_rolled';

const TOP_LEVEL_KEYS: readonly string[] = ['name', 'game', 'description', 'requires', 'triggers'];

const FORBIDDEN_SLOT_CHARS = /[\p{Cc}{}]/u;

export { DEFAULT_PRE_ROLLED_KEY, FORBIDDEN_SLOT_CHARS, MAX_SLOT_NAME_LENGTH, TOP_LEVEL_KEYS };
