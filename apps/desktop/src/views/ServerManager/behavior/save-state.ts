/* @layer renderer-app @kind logic */
import type { SaveBarState } from '@drizztdourden08/tessera/composites';
import type { SaveFacts } from '../ServerManager.type';

const saveState = ({ saving, failed, dirty, saved }: SaveFacts): SaveBarState => {
  if (saving) return 'saving';
  if (failed) return 'error';
  if (dirty) return 'dirty';
  return saved ? 'saved' : 'clean';
};

export { saveState };
