/* @layer core @kind logic */
import type { SourceToolStart } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import { MAX_COMMAND_CHARS } from './tool.constants';
import { parseToolAsk } from './parse-tool-ask';
import { TOOL_TEXT } from './tool-text.constants';

const parseToolStart = (raw: unknown): SourceToolStart => {
  const ask = parseToolAsk(raw);
  if (!isRecord(raw) || typeof raw.command !== 'string' || raw.command.length > MAX_COMMAND_CHARS) throw new Error(TOOL_TEXT.invalid);
  if (raw.confirmed !== true) throw new Error(TOOL_TEXT.confirm);
  return { ...ask, command: raw.command, confirmed: true };
};

export { parseToolStart };
