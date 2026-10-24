/* @layer testing @kind logic */
import type { Bindings, ScenarioFile, ScenarioKit } from '../scenario/scenario.type';
import { sha256Hex } from '../../node/sha256-hex';
import { KIT_BIG_SIZE, KIT_PROOF, KIT_WORLDS, KIT_YAMLS } from './kit.constants';
import { makeApworld } from './make-apworld';
import { makeYaml } from './make-yaml';

const fileOf = (name: string, kind: ScenarioFile['kind'], bytes: Uint8Array): ScenarioFile => ({
  name,
  kind,
  bytes,
  sha256: sha256Hex(bytes),
});

const createScenarioKit = (): ScenarioKit => {
  const worlds = Object.entries(KIT_WORLDS).map(([name, spec]) => fileOf(name, 'world', makeApworld(spec)));
  const yamls = Object.entries(KIT_YAMLS).map(([name, spec]) => fileOf(name, 'yaml', makeYaml(spec)));
  const files = [...worlds, ...yamls];
  const values: Bindings = {
    BIG: sha256Hex('a world that is far too large'),
    BIG_size: KIT_BIG_SIZE,
    MISSING: sha256Hex('a file the hello never declared'),
    proof: KIT_PROOF,
  };
  for (const file of files) {
    values[file.name] = file.sha256;
    values[`${file.name}_size`] = file.bytes.length;
  }
  return { files, values };
};

export { createScenarioKit };
