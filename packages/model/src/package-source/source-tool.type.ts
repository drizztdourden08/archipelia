/* @layer core @kind types */
import type { SourceBuildPlan, SourceBuildTool } from './package-source.type';

type SourceToolOs = 'windows' | 'mac' | 'linux' | 'other';

type SourceToolFound = 'found' | 'missing' | 'unknown';

type SourceToolBlock = 'immutable' | 'unsupported';

type SourceToolElevation = 'none' | 'system';

type SourceToolAfter = 'check' | 'dialog' | 'restart';

type SourceToolLicense = { name: string; url: string };

type SourceToolInstall = { command: string; size: string; source: string; elevation: SourceToolElevation; restart: boolean; license?: SourceToolLicense | undefined };

type SourceToolPlan = {
  tool: SourceBuildTool;
  os: SourceToolOs;
  found: SourceToolFound;
  how: string;
  distro?: string | undefined;
  blocked?: SourceToolBlock | undefined;
  install?: SourceToolInstall | undefined;
};

type SourceToolAsk = { tool: SourceBuildTool; buildId: string };

type SourceToolStart = SourceToolAsk & { command: string; confirmed: boolean };

type SourceToolEnd =
  | { status: 'done'; after: SourceToolAfter; found: SourceToolFound; log: string[]; plan?: SourceBuildPlan | undefined }
  | { status: 'cancelled' }
  | { status: 'failed'; message: string; log: string[] };

export type { SourceToolAfter, SourceToolAsk, SourceToolBlock, SourceToolElevation, SourceToolEnd, SourceToolFound, SourceToolInstall, SourceToolLicense, SourceToolOs, SourceToolPlan, SourceToolStart };
