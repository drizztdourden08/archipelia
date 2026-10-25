/* @layer core @kind config */

const ERROR_LINE = /^\s*\w*(Error|Exception)\b.*:/;

const MISSING_MODULE = /No module named '([^']+)'/;

export { ERROR_LINE, MISSING_MODULE };
