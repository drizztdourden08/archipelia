/* @layer client-kit @kind config */

const BUILD_APWORLD_OPTIONS = {
  world: { type: 'string' },
  out: { type: 'string' },
  game: { type: 'string' },
  'world-version': { type: 'string' },
  'minimum-ap': { type: 'string' },
  'maximum-ap': { type: 'string' },
  module: { type: 'string' },
  data: { type: 'string' },
  author: { type: 'string', multiple: true },
  exclude: { type: 'string', multiple: true },
  'line-endings': { type: 'string' },
} as const;

export { BUILD_APWORLD_OPTIONS };
