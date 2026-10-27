/* @layer core @kind logic */
import type { SourceBuildTool } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import { SOURCE_BUILD_TOOLS } from './tool.constants';
import { TOOL_TEXT } from './tool-text.constants';

const parseToolId = (raw: unknown): SourceBuildTool => {
  const id = isRecord(raw) ? raw.tool : undefined;
  const tool = SOURCE_BUILD_TOOLS.find((name) => name === id);
  if (tool === undefined) throw new Error(TOOL_TEXT.invalid);
  return tool;
};

export { parseToolId };
