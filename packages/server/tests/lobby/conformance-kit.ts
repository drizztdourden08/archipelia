/* @layer tests @kind test */
import { zipSync } from 'fflate';
import { sha256Hex } from '@archipelia/lobby-protocol/node';
import type { ScenarioFile, ScenarioKit } from '@archipelia/lobby-protocol/testing';
import { createScenarioKit, makeApworld } from '@archipelia/lobby-protocol/testing';

const WORLD_SIZE = 812345;

const brokenWorld = () =>
  zipSync({
    'relic_of_the_past/__init__.py': [new TextEncoder().encode('# a world with no manifest\n'), { level: 0 }],
    'relic_of_the_past/padding.bin': [new Uint8Array(WORLD_SIZE - 400).fill(7), { level: 0 }],
  });

const twoDocuments = () => new TextEncoder().encode('name: Link\ngame: Relic of the Past\n---\nname: Other\ngame: Relic of the Past\n');

const OVERRIDES: Record<string, () => Partial<Record<string, Uint8Array>>> = {
  'yaml-invalid': () => ({ Y: twoDocuments() }),
  'world-invalid': () => ({ W: brokenWorld() }),
  'world-range-mismatch': () => ({ W: makeApworld({ module: 'relic_of_the_past', game: 'Relic of the Past', worldVersion: '0.1.0', minimumAp: '0.6.9', size: WORLD_SIZE }) }),
};

const kitFor = (scenario: string): ScenarioKit => {
  const kit = createScenarioKit();
  const replaced = OVERRIDES[scenario]?.() ?? {};
  const files = kit.files.map((file): ScenarioFile => {
    const bytes = replaced[file.name];
    return bytes ? { ...file, bytes, sha256: sha256Hex(bytes) } : file;
  });
  const values = { ...kit.values };
  for (const file of files) {
    values[file.name] = file.sha256;
    values[`${file.name}_size`] = file.bytes.length;
  }
  return { files, values };
};

export { kitFor };
