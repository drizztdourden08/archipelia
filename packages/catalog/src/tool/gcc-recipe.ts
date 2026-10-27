/* @layer core @kind logic */
import { PACKAGE_COMMANDS, PKEXEC } from './tool.constants';
import type { ToolHost, ToolPick } from './tool.type';
import { shownOf } from './shown-of';

const gccRecipe = ({ distro }: ToolHost): ToolPick => {
  if (distro?.immutable) return { blocked: 'immutable' };
  const manager = distro?.manager === undefined ? undefined : PACKAGE_COMMANDS[distro.manager];
  if (!manager) return { blocked: 'unsupported' };
  const args = [manager.file, ...manager.gcc];
  return {
    recipe: {
      kind: 'pkexec', file: PKEXEC, args, shown: shownOf('pkexec', args), size: 'About 150 to 300 MB.', source: `the package manager of ${distro?.name ?? 'this system'}`,
      elevation: 'system', restart: false,
    },
  };
};

export { gccRecipe };
