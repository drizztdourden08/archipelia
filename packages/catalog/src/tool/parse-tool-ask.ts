/* @layer core @kind logic */
import type { SourceToolAsk } from '@archipelia/model';
import { parseBuildId } from '../build/parse-build-id';
import { parseToolId } from './parse-tool-id';

const parseToolAsk = (raw: unknown): SourceToolAsk => ({ tool: parseToolId(raw), buildId: parseBuildId(raw) });

export { parseToolAsk };
