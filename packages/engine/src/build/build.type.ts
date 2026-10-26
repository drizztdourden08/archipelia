/* @layer core @kind types */

type BuildSpec = { command: string; args: string[]; cwd: string; env: Record<string, string> };

type BuildDirs = { work: string; venv: string; src: string; out: string; scratch: string; tools: string };

export type { BuildDirs, BuildSpec };
