/* @layer core @kind logic */
import floor from 'archipelia/registry/registry.json' with { type: 'json' };
import { parseRegistry } from './parse-registry';
import type { Registry } from './registry.type';

const floorRegistry = (): Registry => {
  const parsed = parseRegistry(floor);
  if (!parsed.ok) throw new Error(`the bundled registry is invalid: ${parsed.problems.join('; ')}`);
  return parsed.registry;
};

export { floorRegistry };
