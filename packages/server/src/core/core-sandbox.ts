/* @layer core @kind logic */
import { detectSandbox } from '../sandbox/detect-sandbox';
import { bwrapFeatures } from '../sandbox/bwrap-features';
import { findTool } from '../sandbox/find-tool';
import { probeBwrap } from '../sandbox/probe-bwrap';
import { BWRAP_NAME } from '../sandbox/sandbox.constants';
import type { SandboxRunner } from '../sandbox/sandbox.type';
import type { CorePorts } from './core-ports.type';

const coreSandbox = (platform: string, log: CorePorts['log']) => {
  let detected: Promise<SandboxRunner> | undefined;
  const detect = async () => {
    const runner = await detectSandbox({ platform, find: () => findTool(BWRAP_NAME), features: bwrapFeatures, problem: probeBwrap });
    if (runner.reason && platform === 'linux') log(`Unlisted worlds run with the user's rights: ${runner.reason}.`, 'warn');
    return runner;
  };
  return () => {
    detected ??= detect();
    return detected;
  };
};

export { coreSandbox };
