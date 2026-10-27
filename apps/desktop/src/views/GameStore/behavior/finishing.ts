/* @layer renderer-app @kind logic */
import { reasonOf } from './reason-of';
import { FINISH } from './usePackageSource.constants';
import type { FinishState, Finishing, SetFinish } from './usePackageSource.type';

const finishOf = (result: boolean | undefined): FinishState => {
  if (result === true) return FINISH.done;
  return result === false ? FINISH.idle : FINISH.failed;
};

const finishingOf = (setFinish: SetFinish): Finishing => async (sentence, work) => {
  setFinish(FINISH.running);
  try {
    const result = await work();
    setFinish(finishOf(result));
    return result;
  } catch (err) {
    setFinish({ kind: 'failed', message: reasonOf(err, sentence) });
    return undefined;
  }
};

export { finishingOf };
