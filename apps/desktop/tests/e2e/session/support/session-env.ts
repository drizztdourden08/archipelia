/* @layer tests @kind helper */
type SessionEnv = {
  cli: string;
  instanceA: string;
  instanceB: string;
};

const ENV_NAMES = {
  cli: 'ROTP_CLI',
  instanceA: 'ROTP_INSTANCE_A',
  instanceB: 'ROTP_INSTANCE_B',
} as const;

const DEFAULT_CLI = 'rotp';

const need = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`set ${name} to run the session test (a RotP worktree made with: rotp worktree create <name> --rom <file>)`);
  return value;
};

const sessionEnv = (): SessionEnv => ({
  cli: process.env[ENV_NAMES.cli] ?? DEFAULT_CLI,
  instanceA: need(ENV_NAMES.instanceA),
  instanceB: need(ENV_NAMES.instanceB),
});

export { sessionEnv };
export type { SessionEnv };
