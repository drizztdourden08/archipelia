/* @layer renderer-app @kind logic */
import type { SaveBarState } from '@drizztdourden08/tessera/composites';
import type { SaveFacts } from '../PresetEditor.type';

const saveState = ({ busy, dirty, block, failure, saved }: SaveFacts): SaveBarState => {
  if (busy) return 'saving';
  if (block !== null || (dirty && failure !== null)) return 'error';
  if (dirty) return 'dirty';
  return saved ? 'saved' : 'clean';
};

export { saveState };
