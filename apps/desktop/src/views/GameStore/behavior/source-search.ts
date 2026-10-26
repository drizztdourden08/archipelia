/* @layer renderer-app @kind logic */
import { appApi } from '../../../ipc/app-api';
import { reasonOf } from './reason-of';
import { SEARCHING, SOURCE_FAILURE } from './usePackageSource.constants';
import type { SearchRun } from './usePackageSource.type';

const sourceSearch = async ({ aim, paste, showing, setStep, setResults }: SearchRun): Promise<void> => {
  setStep(showing ? { kind: 'results', suggestions: showing, looking: true } : SEARCHING);
  try {
    const suggestions = await appApi().sourcesSuggest({ apworld: aim.key, module: aim.module, linked: aim.linked, paste });
    setResults(suggestions);
    setStep({ kind: 'results', suggestions, looking: false });
  } catch (err) {
    setStep({ kind: 'failed', message: reasonOf(err, SOURCE_FAILURE.search) });
  }
};

export { sourceSearch };
