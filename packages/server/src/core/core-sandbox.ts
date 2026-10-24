/* @layer core @kind logic */
import { detectSandbox } from '../sandbox/detect-sandbox';
import { findBwrap } from '../sandbox/find-bwrap';
import { probeBwrap } from '../sandbox/probe-bwrap';
import type { SandboxRunner } from '../sandbox/sandbox.type';
import type { CorePorts } from './core-ports.type';

const coreSandbox = (platform: string, log: CorePorts['log']) => {
  let detected: Promise<SandboxRunner> | undefined;
  const detect = async () => {
    const runner = await detectSandbox({ platform, find: () => findBwrap(), problem: probeBwrap });
    if (runner.reason && platform === 'linux') log(`Unlisted worlds run with the user's rights: ${runner.reason}.`, 'warn');
    return runner;
  };
  return () => {
    detected ??= detect();
    return detected;
  };
};

export { coreSandbox };
