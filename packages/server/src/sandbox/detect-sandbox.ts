/* @layer core @kind logic */
import { createBwrapRunner } from './create-bwrap-runner';
import { noSandbox } from './no-sandbox';
import { BASIC_FEATURES } from './sandbox.constants';
import type { SandboxProbe, SandboxRunner } from './sandbox.type';

const detectSandbox = async ({ platform, find, features, problem }: SandboxProbe): Promise<SandboxRunner> => {
  if (platform !== 'linux') return noSandbox(`${platform} has no sandbox for worlds`);
  const bwrap = await find();
  if (!bwrap) return noSandbox('bubblewrap is not installed');
  let refused = '';
  for (const option of [await features(bwrap), BASIC_FEATURES]) {
    const found = await problem(bwrap, option);
    if (found === null) return createBwrapRunner(bwrap, option);
    refused = found;
  }
  return noSandbox(`bubblewrap cannot start here: ${refused}`);
};

export { detectSandbox };
