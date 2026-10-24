/* @layer tooling-scripts @kind logic */
import { cpSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import DEFAULTS from '@archipelia/engine/engine-defaults.json' with { type: 'json' };
import { BUNDLE_DIR } from '../bundle-dir.mjs';
import { currentTarget } from '../current-target.mjs';
import { defaultSpec } from '../default-spec.mjs';

const BUNDLE_FROM_ROOT = BUNDLE_DIR.slice(BUNDLE_DIR.lastIndexOf('tooling'));

const run = async (worktree) => {
  const spec = defaultSpec();
  const names = [spec.id, `${DEFAULTS.defaultAp.version}-${currentTarget()}`];
  const dist = join(worktree.main, BUNDLE_FROM_ROOT, 'dist');
  const name = names.find((candidate) => existsSync(join(dist, candidate, 'engine.json')));
  if (!name) {
    worktree.log(`No built engine at ${join(dist, spec.id)}; the app offers to set one up on first start.`);
    return;
  }
  const into = join(worktree.userData, 'Data', 'engine', name);
  if (existsSync(join(into, 'engine.json'))) return;
  worktree.log(`Copying the engine ${name} into the worktree profile.`);
  cpSync(join(dist, name), into, { recursive: true });
};

/**
 * @returns {{ name: string, run: (worktree: { main: string, userData: string, log: (message: string) => void }) => Promise<void> }}
 */
const engineProvision = () => ({ name: 'engine', run });

export { engineProvision };
