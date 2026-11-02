/* @layer tests @kind helper */
import { execFile } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { promisify } from 'node:util';
import { ROTP_B, ROTP_B_OPTIONS } from './session-constants';
import type { SessionEnv } from './session-env';

const run = promisify(execFile);

const WRITER = 'tooling/apworld/write-player-file.mjs';

const instanceFolderOf = (env: SessionEnv): string => join(env.rotpDir, '.claude', 'worktrees', env.instanceB);

const writeRotpBFile = async (env: SessionEnv): Promise<string> => {
  await mkdir(dirname(ROTP_B.yaml), { recursive: true });
  const args = [WRITER, '--name', ROTP_B.slot, '--out', ROTP_B.yaml, '--set', ...ROTP_B_OPTIONS];
  try {
    await run(process.execPath, args, { cwd: instanceFolderOf(env), windowsHide: true });
  } catch (error) {
    const stderr = error instanceof Error && 'stderr' in error ? String(error.stderr) : String(error);
    throw new Error(`RotP could not write the ${ROTP_B.slot} player file from ${instanceFolderOf(env)}: ${stderr}`);
  }
  return ROTP_B.yaml;
};

export { writeRotpBFile };
