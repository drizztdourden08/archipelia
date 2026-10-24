/* @layer core @kind logic */
import { rm } from 'node:fs/promises';
import { generateSmokeSeed, readSmokeSchemas } from '@archipelia/engine/install';
import type { SmokeDeps } from '@archipelia/engine/install';
import { hostSmokeSeed } from './host-smoke-seed';
import { placeSmokeWorld } from './place-smoke-world';

const createSmokeDeps = (): SmokeDeps => ({
  placeWorld: placeSmokeWorld,
  readSchemas: readSmokeSchemas,
  generateSeed: generateSmokeSeed,
  hostSeed: hostSmokeSeed,
  clearWork: (dir) => rm(dir, { recursive: true, force: true }),
  now: Date.now,
});

export { createSmokeDeps };
