/* @layer tooling-scripts @kind logic */
import { cpSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { BUNDLE_DIR, currentTarget, readPins } from '../pins.mjs';

const BUNDLE_FROM_ROOT = BUNDLE_DIR.slice(BUNDLE_DIR.lastIndexOf('tooling'));

const run = async (worktree) => {
  const pins = await readPins();
  const target = `${pins.ap.version}-${currentTarget()}`;
  const into = join(worktree.userData, 'Data', 'engine', target);
  if (existsSync(join(into, 'engine.json'))) return;
  const from = join(worktree.main, BUNDLE_FROM_ROOT, 'dist', target);
  if (!existsSync(join(from, 'engine.json'))) {
    worktree.log(`No built engine at ${from}; the app offers to set one up on first start.`);
    return;
  }
  worktree.log(`Copying the engine ${target} into the worktree profile.`);
  cpSync(from, into, { recursive: true });
};

/**
 * @returns {{ name: string, run: (worktree: { main: string, userData: string, log: (message: string) => void }) => Promise<void> }}
 */
const engineProvision = () => ({ name: 'engine', run });

export { engineProvision };
