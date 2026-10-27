/* @layer core @kind logic */
import { CMAKE_PACKAGE } from './tool.constants';
import type { ToolPick } from './tool.type';
import { shownOf } from './shown-of';

const cmakeRecipe = (): ToolPick => {
  const args = ['-m', 'pip', 'install', '--only-binary=:all:', '--require-hashes', CMAKE_PACKAGE];
  return {
    recipe: {
      kind: 'pip', file: 'python', args, shown: shownOf('python', args), size: 'About 40 MB.',
      source: 'the Python Package Index, as a ready-made file pinned by checksum, into the private build folder only', elevation: 'none', restart: false,
    },
  };
};

export { cmakeRecipe };
