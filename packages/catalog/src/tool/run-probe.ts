/* @layer core @kind logic */
import { execFile } from 'node:child_process';
import { PROBE_TIMEOUT_MS } from './tool.constants';
import type { Probe } from './tool.type';

const runProbe: Probe = (file, args, env) =>
  new Promise((resolve) => {
    const extra = env ? { env: { ...process.env, ...env } } : {};
    execFile(file, args, { timeout: PROBE_TIMEOUT_MS, windowsHide: true, ...extra }, (error, stdout) => resolve({ ok: error === null, out: String(stdout) }));
  });

export { runProbe };
