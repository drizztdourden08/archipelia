/* @layer renderer-app @kind logic */
import { appApi } from '../../../ipc/app-api';
import { reasonOf } from './reason-of';
import { SOURCE_FAILURE } from './usePackageSource.constants';
import type { PypiRun } from './usePackageSource.type';

const sourcePypi = async ({ aim, state, ask, setStep }: PypiRun): Promise<boolean> => {
  const ref = { owner: state.plan.owner, repo: state.plan.repo, module: aim.module };
  setStep({ ...state, installing: true });
  try {
    const preview = await appApi().sourcesPypiPreview(ref);
    const accepted = await ask(aim.title, preview.packages);
    if (accepted) await appApi().sourcesPypiInstall({ ...ref, packages: preview.packages.map((entry) => entry.pin) });
    setStep({ ...state, installing: false });
    return accepted;
  } catch (err) {
    setStep({ kind: 'failed', message: reasonOf(err, SOURCE_FAILURE.pypi) });
    return false;
  }
};

export { sourcePypi };
