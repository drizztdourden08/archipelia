/* @layer renderer-app @kind logic */
import { appApi } from '../../../ipc/app-api';
import { reasonOf } from './reason-of';
import { SOURCE_FAILURE } from './usePackageSource.constants';
import type { WheelRun } from './usePackageSource.type';

const sourceWheel = async ({ aim, state, typed, install, setStep, close }: WheelRun): Promise<void> => {
  const { request } = aim;
  const { wheel, owner, repo } = state.plan;
  if (!request || request.kind === 'official' || !wheel) return;
  setStep({ ...state, installing: true });
  try {
    const source = await appApi().sourcesWheel({ owner, repo, module: aim.module, tag: wheel.tag, asset: wheel.asset, typed });
    const installed = await install({ ...request, wheels: [source.sha256] }, aim.key);
    if (installed === true) close();
    else setStep({ ...state, installing: false });
  } catch (err) {
    setStep({ kind: 'failed', message: reasonOf(err, SOURCE_FAILURE.wheel) });
  }
};

export { sourceWheel };
