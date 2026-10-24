/* @layer renderer-app @kind logic */
import { confirmAction, toast } from '@drizztdourden08/brock-react';
import type { EngineInstallResult } from '@archipelia/model';
import { logFailure } from '../../../hooks/log-failure';
import type { FinishInstallInput } from '../EngineSettings.type';
import { brokenWorldsConfirm } from './broken-worlds-confirm';
import { installFailure } from './install-failure';

const finishInstall = async (result: EngineInstallResult, { ap, switchTo }: FinishInstallInput): Promise<void> => {
  if (result.outcome === 'switched') toast(`Archipelago ${ap} is now the engine.`, { variant: 'success' });
  if (result.outcome === 'failed') {
    const sentence = installFailure(result);
    logFailure(sentence, result.error ?? 'no detail given');
    toast(sentence, { variant: 'danger' });
  }
  if (result.outcome !== 'ready' || !result.id) return;
  const worlds = result.brokenWorlds ?? [];
  if (worlds.length === 0 || await confirmAction(brokenWorldsConfirm(ap, worlds))) await switchTo(result.id);
};

export { finishInstall };
