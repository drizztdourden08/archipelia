/* @layer client-kit @kind config */

const PLAYER_YAML_OPTIONS = {
  input: { type: 'string' },
  schema: { type: 'string' },
  out: { type: 'string' },
  'allow-unknown': { type: 'boolean' },
  'allow-roll': { type: 'boolean' },
  'with-defaults': { type: 'boolean' },
} as const;

export { PLAYER_YAML_OPTIONS };
