/* @layer renderer-app @kind logic */
import { appApi } from '../../../ipc/app-api';
import { SOURCE_FAILURE } from './usePackageSource.constants';
import type { PypiRun } from './usePackageSource.type';

const sourcePypi = async ({ aim, state, ask, install, finishing }: PypiRun): Promise<void> => {
  const ref = { owner: state.plan.owner, repo: state.plan.repo, module: aim.module };
  await finishing(SOURCE_FAILURE.pypi, async () => {
    const preview = await appApi().sourcesPypiPreview(ref);
    if (!(await ask(aim.title, preview.packages))) return false;
    await appApi().sourcesPypiInstall({ ...ref, packages: preview.packages.map((entry) => entry.pin) });
    return aim.request ? install(aim.request, aim.key) : false;
  });
};

export { sourcePypi };
