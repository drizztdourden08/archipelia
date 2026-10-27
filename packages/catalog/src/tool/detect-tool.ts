/* @layer core @kind logic */
import { win32 } from 'node:path';
import type { SourceBuildTool, SourceToolFound } from '@archipelia/model';
import { CC_CANDIDATES, PROGRAM_FILES_X86, VSWHERE_ARGS, VSWHERE_PATH, XCODE_SELECT } from './tool.constants';
import type { Probe, ToolHost } from './tool.type';
import { cargoCandidatesOf } from './cargo-candidates-of';
import { toolKeyOf } from './tool-key-of';

const firstOk = async (probe: Probe, files: readonly string[], args: string[]): Promise<SourceToolFound> => {
  for (const file of files) if ((await probe(file, args)).ok) return 'found';
  return 'missing';
};

const detectMsvc = async (host: ToolHost, probe: Probe): Promise<SourceToolFound> => {
  const vswhere = win32.join(host.env['ProgramFiles(x86)'] ?? PROGRAM_FILES_X86, ...VSWHERE_PATH);
  const result = await probe(vswhere, [...VSWHERE_ARGS]);
  return result.ok && result.out.trim() !== '' ? 'found' : 'missing';
};

const detectTool = (tool: SourceBuildTool, host: ToolHost, probe: Probe): Promise<SourceToolFound> => {
  switch (toolKeyOf(tool, host.platform)) {
    case 'msvc':
      return detectMsvc(host, probe);
    case 'gcc':
      return firstOk(probe, CC_CANDIDATES, ['--version']);
    case 'xcode':
      return firstOk(probe, [XCODE_SELECT], ['-p']);
    case 'rust':
      return firstOk(probe, cargoCandidatesOf(host), ['--version']);
    case 'cmake':
    case undefined:
      return Promise.resolve('unknown');
  }
};

export { detectTool };
