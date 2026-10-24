/* @layer core @kind logic */
import type { SpawnCommand } from '@archipelia/engine';
import { ISOLATION_FLAGS, NO_USERNS_FLAGS, RUN_LIMITS, SANDBOX_TMP, SYSTEM_PATHS, TMP_BYTES } from './sandbox.constants';
import { sandboxEnv } from './sandbox-env';
import type { BwrapFeatures, SandboxScope } from './sandbox.type';

const binds = (flag: string, paths: string[]) => paths.flatMap((path) => [flag, path, path]);

const launcher = (bwrap: string, features: BwrapFeatures) => (features.prlimit ? [features.prlimit, ...RUN_LIMITS, '--', bwrap] : [bwrap]);

const bwrapCommand = (bwrap: string, features: BwrapFeatures, scope: SandboxScope, command: SpawnCommand): SpawnCommand => {
  const [file = bwrap, ...args] = [
    ...launcher(bwrap, features),
    ...ISOLATION_FLAGS,
    ...(features.disableUserns ? NO_USERNS_FLAGS : []),
    ...binds('--ro-bind-try', SYSTEM_PATHS),
    '--proc', '/proc', '--dev', '/dev',
    ...(features.tmpfsSize ? ['--size', TMP_BYTES] : []),
    '--tmpfs', SANDBOX_TMP,
    ...binds('--ro-bind', scope.readOnly),
    ...binds('--bind', scope.readWrite),
    '--chdir', command.cwd,
    '--', command.file, ...command.args,
  ];
  return { file, args, cwd: command.cwd, env: sandboxEnv(command.env) };
};

export { bwrapCommand };
