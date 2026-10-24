/* @layer core @kind logic */
import { execFile } from 'node:child_process';
import { findTool } from './find-tool';
import { PRLIMIT_NAME, PROBE_TIMEOUT_MS } from './sandbox.constants';
import type { BwrapFeatures } from './sandbox.type';

const helpOf = (bwrap: string) => new Promise<string>((resolve) => {
  execFile(bwrap, ['--help'], { timeout: PROBE_TIMEOUT_MS, windowsHide: true }, (_error, stdout, stderr) => resolve(`${stdout}\n${stderr}`));
});

const bwrapFeatures = async (bwrap: string): Promise<BwrapFeatures> => {
  const help = await helpOf(bwrap);
  return { tmpfsSize: help.includes('--size'), disableUserns: help.includes('--disable-userns'), prlimit: await findTool(PRLIMIT_NAME) };
};

export { bwrapFeatures };
