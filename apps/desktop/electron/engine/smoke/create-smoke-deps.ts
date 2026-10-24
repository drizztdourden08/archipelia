/* @layer electron-main @kind logic */
import { rm } from 'node:fs/promises';
import { generateSmokeSeed } from './generate-smoke-seed';
import { hostSmokeSeed } from './host-smoke-seed';
import { placeSmokeWorld } from './place-smoke-world';
import { readSmokeSchemas } from './read-smoke-schemas';
import type { SmokeDeps } from './smoke.type';

const createSmokeDeps = (): SmokeDeps => ({
  placeWorld: placeSmokeWorld,
  readSchemas: readSmokeSchemas,
  generateSeed: generateSmokeSeed,
  hostSeed: hostSmokeSeed,
  clearWork: (dir) => rm(dir, { recursive: true, force: true }),
  now: Date.now,
});

export { createSmokeDeps };
