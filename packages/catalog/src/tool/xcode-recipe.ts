/* @layer core @kind logic */
import { XCODE_SELECT } from './tool.constants';
import type { ToolPick } from './tool.type';
import { shownOf } from './shown-of';

const xcodeRecipe = (): ToolPick => {
  const args = ['--install'];
  return {
    recipe: {
      kind: 'xcode', file: XCODE_SELECT, args, shown: shownOf('xcode-select', args), size: 'About 1 to 2 GB.', source: 'Apple, through its own installer window', elevation: 'system', restart: false,
    },
  };
};

export { xcodeRecipe };
