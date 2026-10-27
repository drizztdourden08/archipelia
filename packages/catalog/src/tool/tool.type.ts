/* @layer core @kind types */
import type { SourceBuildPlan, SourceBuildTool, SourceToolBlock, SourceToolElevation } from '@archipelia/model';
import type { Fetch } from '../install/fetch-file.type';
import type { BuildRunner } from '../build/build.type';

type PackageManager = 'apt' | 'dnf' | 'pacman' | 'zypper';

type ImmutableFamily = 'steamos' | 'nixos' | 'ostree';

type Distro = { name: string; manager: PackageManager | undefined; immutable: ImmutableFamily | undefined };

type ToolKey = 'msvc' | 'gcc' | 'xcode' | 'rust' | 'cmake';

type ToolKind = 'winget' | 'bootstrapper' | 'pkexec' | 'xcode' | 'rustup' | 'pip';

type ToolEnv = Readonly<Record<string, string | undefined>>;

type ToolHost = { platform: NodeJS.Platform; arch: string; env: ToolEnv; toolsDir: string; distro?: Distro | undefined; winget?: string | undefined };

type ToolRecipe = {
  kind: ToolKind;
  file: string;
  args: string[];
  shown: string;
  size: string;
  source: string;
  elevation: SourceToolElevation;
  restart: boolean;
};

type ToolPick = { recipe: ToolRecipe } | { blocked: SourceToolBlock };

type ProbeResult = { ok: boolean; out: string };

type Probe = (file: string, args: string[], env?: Record<string, string>) => Promise<ProbeResult>;

type ToolSpec = { command: string; args: string[]; cwd: string; env: Record<string, string> };

type ToolRunner = (elevation: SourceToolElevation, tool: SourceBuildTool) => ReturnType<BuildRunner>;

type ToolDeps = {
  fetch: Fetch;
  toolsDir: () => Promise<string>;
  readHost: (toolsDir: string) => Promise<ToolHost>;
  probe: Probe;
  run?: ToolRunner | undefined;
  hasTool: (buildId: string, name: string) => boolean;
  addTool: (buildId: string, name: string) => Promise<SourceBuildPlan>;
  log?: ((message: string) => void) | undefined;
};

type Download = { url: string; hosts: readonly string[]; maxBytes: number };

export type { Distro, Download, ImmutableFamily, PackageManager, Probe, ProbeResult, ToolDeps, ToolEnv, ToolHost, ToolKey, ToolPick, ToolRecipe, ToolRunner, ToolSpec };
