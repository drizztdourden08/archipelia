/* @layer renderer-app @kind logic */
import { appApi } from '../../../ipc/app-api';
import { SOURCE_FAILURE } from './usePackageSource.constants';
import type { WheelRun } from './usePackageSource.type';

const sourceWheel = async ({ aim, state, typed, install, finishing }: WheelRun): Promise<void> => {
  const { request } = aim;
  const { wheel, owner, repo } = state.plan;
  if (!request || request.kind === 'official' || !wheel) return;
  await finishing(SOURCE_FAILURE.wheel, async () => {
    const source = await appApi().sourcesWheel({ owner, repo, module: aim.module, tag: wheel.tag, asset: wheel.asset, typed });
    return install({ ...request, wheels: [source.sha256] }, aim.key);
  });
};

export { sourceWheel };
