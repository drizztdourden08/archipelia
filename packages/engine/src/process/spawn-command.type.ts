/* @layer core @kind types */

type SpawnCommand = { file: string; args: string[]; cwd: string; env: NodeJS.ProcessEnv };

type SpawnWrap = (command: SpawnCommand) => SpawnCommand;

export type { SpawnCommand, SpawnWrap };
