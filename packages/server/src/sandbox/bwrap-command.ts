/* @layer core @kind logic */
import type { SpawnCommand } from '@archipelia/engine';
import { ISOLATION_FLAGS, SANDBOX_TMP, SYSTEM_PATHS } from './sandbox.constants';
import { sandboxEnv } from './sandbox-env';
import type { SandboxScope } from './sandbox.type';

const binds = (flag: string, paths: string[]) => paths.flatMap((path) => [flag, path, path]);

const bwrapCommand = (bwrap: string, scope: SandboxScope, command: SpawnCommand): SpawnCommand => ({
  file: bwrap,
  args: [
    ...ISOLATION_FLAGS,
    ...binds('--ro-bind-try', SYSTEM_PATHS),
    '--proc', '/proc', '--dev', '/dev', '--tmpfs', SANDBOX_TMP,
    ...binds('--ro-bind', scope.readOnly),
    ...binds('--bind', scope.readWrite),
    '--chdir', command.cwd,
    '--', command.file, ...command.args,
  ],
  cwd: command.cwd,
  env: sandboxEnv(command.env),
});

export { bwrapCommand };
