/* @layer core @kind logic */
import { posix, win32 } from 'node:path';
import { RUST_FOLDERS } from './tool.constants';
import type { ToolHost } from './tool.type';

const cargoCandidatesOf = (host: ToolHost): string[] => {
  const path = host.platform === 'win32' ? win32 : posix;
  const name = host.platform === 'win32' ? 'cargo.exe' : 'cargo';
  return [path.join(host.toolsDir, RUST_FOLDERS.cargo, 'bin', name)];
};

export { cargoCandidatesOf };
