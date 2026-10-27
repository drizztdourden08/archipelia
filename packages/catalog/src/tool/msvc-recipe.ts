/* @layer core @kind logic */
import { VS_BOOTSTRAPPER_NAME, VS_LICENSE, VS_SWITCHES, WINGET_ARGS } from './tool.constants';
import type { ToolHost, ToolPick } from './tool.type';
import { shownOf } from './shown-of';

const msvcRecipe = ({ winget }: ToolHost): ToolPick => {
  const SIZE = 'About 3 to 7 GB, and 5 to 20 minutes. Windows may need a restart when it ends.';
  if (winget !== undefined) {
    return { recipe: { kind: 'winget', file: winget, args: [...WINGET_ARGS], shown: shownOf(winget, WINGET_ARGS), size: SIZE, source: 'winget, from Microsoft', elevation: 'system', restart: true, license: VS_LICENSE } };
  }
  return {
    recipe: {
      kind: 'bootstrapper', file: VS_BOOTSTRAPPER_NAME, args: [...VS_SWITCHES], shown: shownOf(VS_BOOTSTRAPPER_NAME, VS_SWITCHES), size: SIZE,
      source: 'the Visual Studio installer, downloaded from aka.ms and checked for Microsoft\'s signature', elevation: 'system', restart: true, license: VS_LICENSE,
    },
  };
};

export { msvcRecipe };
