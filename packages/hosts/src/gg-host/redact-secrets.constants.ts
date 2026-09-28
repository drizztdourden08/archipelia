/* @layer core @kind config */

const RULES: [RegExp, string][] = [
  [/(Password: ).*?(\)?)$/, '$1***$2'],
  [/(Set option (?:server_)?password to ).*$/, '$1***'],
];

export { RULES };
