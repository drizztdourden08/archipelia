/* @layer tests @kind helper */
type SessionEnv = {
  rotpDir: string;
  instanceA: string;
  instanceB: string;
};

const ENV_NAMES = {
  rotpDir: 'ROTP_DIR',
  instanceA: 'ROTP_INSTANCE_A',
  instanceB: 'ROTP_INSTANCE_B',
} as const;

const DEFAULT_ROTP_DIR = 'X:/relic-of-the-past';

const need = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`set ${name} to run the session test (a RotP worktree made with: rotp worktree create <name> --rom <file>)`);
  return value;
};

const sessionEnv = (): SessionEnv => ({
  rotpDir: process.env[ENV_NAMES.rotpDir] ?? DEFAULT_ROTP_DIR,
  instanceA: need(ENV_NAMES.instanceA),
  instanceB: need(ENV_NAMES.instanceB),
});

export { sessionEnv };
export type { SessionEnv };
