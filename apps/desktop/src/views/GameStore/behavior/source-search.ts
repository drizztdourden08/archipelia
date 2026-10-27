/* @layer renderer-app @kind logic */
import { appApi } from '../../../ipc/app-api';
import { reasonOf } from './reason-of';
import { SOURCE_FAILURE } from './usePackageSource.constants';
import type { SearchRun } from './usePackageSource.type';

const sourceSearch = async ({ aim, paste, search, setSearch }: SearchRun): Promise<void> => {
  const { suggestions } = search;
  setSearch({ suggestions, looking: suggestions !== null, failed: undefined });
  try {
    const found = await appApi().sourcesSuggest({ apworld: aim.key, module: aim.module, linked: aim.linked, paste });
    setSearch({ suggestions: found, looking: false, failed: undefined });
  } catch (err) {
    setSearch({ suggestions, looking: false, failed: reasonOf(err, SOURCE_FAILURE.search) });
  }
};

export { sourceSearch };
