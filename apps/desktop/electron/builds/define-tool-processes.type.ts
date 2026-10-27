/* @layer electron-main @kind types */
import type { SourceBuildTool } from '@archipelia/model';

type ToolSpecOf = (raw: { tool: SourceBuildTool }) => Promise<{ command: string; args: string[]; cwd: string; env: Record<string, string> }>;

export type { ToolSpecOf };
