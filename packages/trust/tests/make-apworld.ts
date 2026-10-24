/* @layer tests @kind helper */
import { strToU8, zipSync } from 'fflate';

const makeApworld = (game: string, module = 'relic_of_the_past') =>
  zipSync({
    [`${module}/__init__.py`]: strToU8('# world'),
    [`${module}/archipelago.json`]: strToU8(JSON.stringify({ game, world_version: '0.1.0', minimum_ap_version: '0.6.4' })),
  });

export { makeApworld };
