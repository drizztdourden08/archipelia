/* @layer core @kind logic */
import type { SourceBuildTool } from '@archipelia/model';
import { IMMUTABLE_HOWS, MSVC_BY_HAND, PACKAGE_COMMANDS, RUST_UNIX_HOW, WINGET_HOWS } from './tool.constants';
import type { ToolHost, ToolPick } from './tool.type';
import { shownOf } from './shown-of';
import { toolKeyOf } from './tool-key-of';

const managerLine = ({ distro }: ToolHost, part: 'gcc' | 'cmake'): string => {
  const manager = distro?.manager === undefined ? undefined : PACKAGE_COMMANDS[distro.manager];
  return manager ? shownOf(manager.shown, manager[part]) : '';
};

const gccHow = (host: ToolHost): string => {
  const family = host.distro?.immutable;
  return family === undefined ? managerLine(host, 'gcc') : IMMUTABLE_HOWS[family];
};

const cmakeHow = (host: ToolHost): string => {
  if (host.platform === 'win32') return WINGET_HOWS.cmake ?? '';
  return host.platform === 'darwin' ? 'brew install cmake' : managerLine(host, 'cmake');
};

const msvcHow = (pick: ToolPick): string => ('recipe' in pick && pick.recipe.kind === 'winget' ? pick.recipe.shown : MSVC_BY_HAND);

const howOf = (tool: SourceBuildTool, host: ToolHost, pick: ToolPick): string => {
  switch (toolKeyOf(tool, host.platform)) {
    case 'msvc':
      return msvcHow(pick);
    case 'gcc':
      return gccHow(host);
    case 'xcode':
      return 'xcode-select --install';
    case 'rust':
      return host.platform === 'win32' ? (WINGET_HOWS.rust ?? '') : RUST_UNIX_HOW;
    case 'cmake':
      return cmakeHow(host);
    case undefined:
      return '';
  }
};

export { howOf };
