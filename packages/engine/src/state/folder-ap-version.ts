/* @layer core @kind logic */
import { LEGACY_FOLDER } from './engine-state.constants';

const folderApVersion = (name: string, stored: Record<string, unknown>, target: string): string | undefined => {
  const folder = LEGACY_FOLDER.exec(name);
  if (folder?.[2] !== target) return undefined;
  const version = typeof stored.apVersion === 'string' ? stored.apVersion : folder[1];
  if (!version) return undefined;
  return version;
};

export { folderApVersion };
