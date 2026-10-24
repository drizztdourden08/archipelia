/* @layer core @kind logic */
import { execFile } from 'node:child_process';
import { bwrapCommand } from './bwrap-command';
import { PROBE_COMMAND, PROBE_TIMEOUT_MS, SANDBOX_TMP } from './sandbox.constants';
import type { BwrapFeatures } from './sandbox.type';
import { taskCount } from './task-count';

const probeBwrap = (bwrap: string, features: BwrapFeatures): Promise<string | null> => {
  const probe = bwrapCommand({ bwrap, features, tasks: taskCount() }, { readOnly: [], readWrite: [] }, { file: PROBE_COMMAND, args: [], cwd: SANDBOX_TMP, env: {} });
  return new Promise((resolve) => {
    execFile(probe.file, probe.args, { cwd: SANDBOX_TMP, env: probe.env, timeout: PROBE_TIMEOUT_MS, windowsHide: true }, (error, _stdout, stderr) => {
      resolve(error ? (stderr.trim() || error.message) : null);
    });
  });
};

export { probeBwrap };
