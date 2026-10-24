/* @layer client-kit @kind types */

type CliIo = { cwd: string; out: (text: string) => void; err: (text: string) => void };

type Command = (args: readonly string[], io: CliIo) => Promise<number>;

export type { CliIo, Command };
