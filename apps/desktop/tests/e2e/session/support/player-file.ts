/* @layer tests @kind helper */
import { execFile } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { basename, dirname } from 'node:path';
import { promisify } from 'node:util';
import { ROTP_B, ROTP_B_OPTIONS } from './session-constants';
import type { SessionEnv } from './session-env';

const run = promisify(execFile);

const WRITER = 'tooling/apworld/write-player-file.mjs';

const worktreePathsOf = (porcelain: string): string[] =>
  porcelain.split(/\r?\n/).filter((line) => line.startsWith('worktree ')).map((line) => line.slice('worktree '.length).trim());

const instanceFolderOf = async (env: SessionEnv): Promise<string> => {
  const { stdout } = await run('git', ['worktree', 'list', '--porcelain'], { cwd: env.rotpDir, windowsHide: true });
  const found = worktreePathsOf(stdout).find((path) => basename(path) === env.instanceB);
  if (!found) throw new Error(`no git worktree named ${env.instanceB} in ${env.rotpDir}`);
  return found;
};

const writeRotpBFile = async (env: SessionEnv): Promise<string> => {
  await mkdir(dirname(ROTP_B.yaml), { recursive: true });
  const args = [WRITER, '--name', ROTP_B.slot, '--out', ROTP_B.yaml, '--set', ...ROTP_B_OPTIONS];
  const cwd = await instanceFolderOf(env);
  try {
    await run(process.execPath, args, { cwd, windowsHide: true });
  } catch (error) {
    const stderr = error instanceof Error && 'stderr' in error ? String(error.stderr) : String(error);
    throw new Error(`RotP could not write the ${ROTP_B.slot} player file from ${cwd}: ${stderr}`, { cause: error });
  }
  return ROTP_B.yaml;
};

export { writeRotpBFile };
