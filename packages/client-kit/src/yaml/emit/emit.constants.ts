/* @layer client-kit @kind config */

const INDENT = '  ';

const MAX_DEPTH = 64;

const RESERVED = /^(?:true|false|yes|no|on|off|y|n|null|random)$/i;

const PLAIN = /^[A-Za-z_][\w ./()-]*$/;

const NEEDS_ESCAPE = /[\p{Cc}\u2028\u2029\ufeff\ufffe\uffff"\\]/gu;

const LONE_SURROGATE = /\p{Cs}/u;

const SHORT_ESCAPES: Readonly<Record<string, string>> = {
  '"': '\\"',
  '\\': '\\\\',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
};

export { INDENT, LONE_SURROGATE, MAX_DEPTH, NEEDS_ESCAPE, PLAIN, RESERVED, SHORT_ESCAPES };
