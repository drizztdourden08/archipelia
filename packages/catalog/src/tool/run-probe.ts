/* @layer core @kind logic */
import { execFile } from 'node:child_process';
import { PROBE_TIMEOUT_MS } from './tool.constants';
import type { Probe } from './tool.type';

const runProbe: Probe = (file, args, env) =>
  new Promise((resolve) => {
    const options = { timeout: PROBE_TIMEOUT_MS, windowsHide: true, ...(env ? { env: { ...process.env, ...env } } : {}) };
    execFile(file, args, options, (error, stdout) => resolve({ ok: error === null, out: String(stdout) }));
  });

export { runProbe };
