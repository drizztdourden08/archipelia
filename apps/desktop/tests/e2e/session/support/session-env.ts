/* @layer tests @kind helper */
type SessionEnv = {
  binA: string;
  binB: string;
  rom: string;
};

const need = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`set ${name} to run the session test`);
  return value;
};

const binOf = (own: string, shared: string): string => process.env[own] ?? need(shared);

// RotP-A and RotP-B each run their own RotP checkout or binary: ROTP_BIN_A and ROTP_BIN_B, or ROTP_BIN for both.
const sessionEnv = (): SessionEnv => ({
  binA: binOf('ROTP_BIN_A', 'ROTP_BIN'),
  binB: binOf('ROTP_BIN_B', 'ROTP_BIN'),
  rom: need('ROTP_ROM'),
});

export { sessionEnv };
export type { SessionEnv };
