/* @layer server @kind types */
type ParsedCommand = { name: string; words: string[]; flags: Record<string, string> };

type CliContext = {
  dataDir: string;
  args: readonly string[];
  env: Readonly<Record<string, string | undefined>>;
  out: (line: string) => void;
  err: (line: string) => void;
};

type CliCommand = (command: ParsedCommand, context: CliContext) => Promise<number>;

export type { CliCommand, CliContext, ParsedCommand };
