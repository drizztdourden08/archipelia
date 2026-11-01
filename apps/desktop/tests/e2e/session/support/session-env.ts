/* @layer tests @kind helper */
type SessionEnv = {
  bin: string;
  rom: string;
  yamlFlag: string;
};

const need = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`set ${name} to run the session test`);
  return value;
};

// TODO(rotp lead): confirm the flag that hands RotP-A its randomizer options YAML. Override it with ROTP_YAML_FLAG.
const DEFAULT_YAML_FLAG = '--options-yaml';

const sessionEnv = (): SessionEnv => ({
  bin: need('ROTP_BIN'),
  rom: need('ROTP_ROM'),
  yamlFlag: process.env.ROTP_YAML_FLAG ?? DEFAULT_YAML_FLAG,
});

export { sessionEnv };
export type { SessionEnv };
