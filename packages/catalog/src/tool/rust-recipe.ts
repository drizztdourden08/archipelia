/* @layer core @kind logic */
import { RUSTUP_ARGS } from './tool.constants';
import type { ToolHost, ToolPick } from './tool.type';
import { rustupUrlOf } from './rustup-url-of';
import { shownOf } from './shown-of';

const rustRecipe = (host: ToolHost): ToolPick => {
  const url = rustupUrlOf(host);
  if (url === undefined) return { blocked: 'unsupported' };
  const file = host.platform === 'win32' ? 'rustup-init.exe' : 'rustup-init';
  return {
    recipe: {
      kind: 'rustup', file, args: [...RUSTUP_ARGS], shown: shownOf(file, RUSTUP_ARGS), size: 'About 300 to 600 MB.', source: `${url}, checked against the checksum published next to it`,
      elevation: 'none', restart: false,
    },
  };
};

export { rustRecipe };
