/* @layer core @kind logic */
import type { SourceBuildTool } from '@archipelia/model';
import type { ToolHost, ToolPick } from './tool.type';
import { cmakeRecipe } from './cmake-recipe';
import { gccRecipe } from './gcc-recipe';
import { msvcRecipe } from './msvc-recipe';
import { rustRecipe } from './rust-recipe';
import { toolKeyOf } from './tool-key-of';
import { xcodeRecipe } from './xcode-recipe';

const recipeOf = (tool: SourceBuildTool, host: ToolHost): ToolPick => {
  switch (toolKeyOf(tool, host.platform)) {
    case 'msvc':
      return msvcRecipe(host);
    case 'gcc':
      return gccRecipe(host);
    case 'xcode':
      return xcodeRecipe();
    case 'rust':
      return rustRecipe(host);
    case 'cmake':
      return cmakeRecipe();
    case undefined:
      return { blocked: 'unsupported' };
  }
};

export { recipeOf };
