/* @layer core @kind logic */
import { createBwrapRunner } from './create-bwrap-runner';
import { noSandbox } from './no-sandbox';
import type { SandboxProbe, SandboxRunner } from './sandbox.type';

const detectSandbox = async ({ platform, find, problem }: SandboxProbe): Promise<SandboxRunner> => {
  if (platform !== 'linux') return noSandbox(`${platform} has no sandbox for worlds`);
  const bwrap = await find();
  if (!bwrap) return noSandbox('bubblewrap is not installed');
  const refused = await problem(bwrap);
  return refused ? noSandbox(`bubblewrap cannot start here: ${refused}`) : createBwrapRunner(bwrap);
};

export { detectSandbox };
