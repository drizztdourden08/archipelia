/* @layer renderer-app @kind logic */
import type { CheckRun } from './usePackageSource.type';

const sourceCheck = async ({ aim, state, install, setStep, close }: CheckRun): Promise<void> => {
  if (!aim.request) return;
  setStep({ ...state, checking: true, stillMissing: false });
  const result = await install(aim.request, aim.key);
  if (result === true) close();
  else setStep({ ...state, checking: false, stillMissing: result === undefined });
};

export { sourceCheck };
