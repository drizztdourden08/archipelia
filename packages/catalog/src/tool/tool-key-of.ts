/* @layer core @kind logic */
import type { SourceBuildTool } from '@archipelia/model';
import { TOOL_KEYS } from './tool.constants';
import type { ToolKey } from './tool.type';

const toolKeyOf = (tool: SourceBuildTool, platform: NodeJS.Platform): ToolKey | undefined => TOOL_KEYS[tool][platform];

export { toolKeyOf };
