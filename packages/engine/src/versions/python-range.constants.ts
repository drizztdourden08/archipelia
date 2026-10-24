/* @layer core @kind config */

const BRANCH_START = /^(if|elif|else)\b/;

const BRANCH_BODY = /^(\s|$|#)/;

const VERSION_INFO = 'sys.version_info';

const PLATFORM_LIST = /sys\.platform\s+in\s+\(([^)]*)\)/;

const PLATFORM_EQUAL = /sys\.platform\s*==\s*["']([^"']+)["']/;

const QUOTED = /["']([^"']+)["']/g;

const RANGE_DECLARED = /not\s*\(([\d,\s]+)\)\s*<=\s*sys\.version_info\s*<\s*\(([\d,\s]+)\)/;

const MIN_DECLARED = /not\s*\(([\d,\s]+)\)\s*<=\s*sys\.version_info/;

const BELOW = /sys\.version_info\s*<\s*\(([\d,\s]+)\)/;

const AT_LEAST = /sys\.version_info\s*>=\s*\(([\d,\s]+)\)/;

const RAISES = /\braise\b/;

const WARNS = /warnings\.warn|\bwarn\(/;

export { AT_LEAST, BELOW, BRANCH_BODY, BRANCH_START, MIN_DECLARED, PLATFORM_EQUAL, PLATFORM_LIST, QUOTED, RAISES, RANGE_DECLARED, VERSION_INFO, WARNS };
