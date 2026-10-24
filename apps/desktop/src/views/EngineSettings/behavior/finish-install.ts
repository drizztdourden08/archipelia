/* @layer renderer-app @kind logic */
import { confirmAction, toast } from '@drizztdourden08/brock-react';
import type { EngineInstallResult } from '@archipelia/model';
import { logFailure } from '../../../hooks/log-failure';
import type { FinishInstall, FinishInstallInput } from '../EngineSettings.type';
import { brokenWorldsConfirm } from './broken-worlds-confirm';
import { installFailure } from './install-failure';
import { testedVersionConfirm } from './tested-version-confirm';

const reportFailure = async (result: EngineInstallResult, input: FinishInstallInput, again: FinishInstall): Promise<void> => {
  const sentence = installFailure(result);
  logFailure(sentence, result.error ?? 'no detail given');
  toast(sentence, { variant: 'danger' });
  const { fallback } = result;
  if (!fallback || !(await confirmAction(testedVersionConfirm(input.ap, fallback)))) return;
  await again(await input.install(fallback), { ...input, ap: fallback.ap });
};

const finishInstall = async (result: EngineInstallResult, input: FinishInstallInput): Promise<void> => {
  if (result.outcome === 'switched') toast(`Archipelago ${input.ap} is now the engine.`, { variant: 'success' });
  if (result.outcome === 'failed') await reportFailure(result, input, finishInstall);
  if (result.outcome !== 'ready' || !result.id) return;
  const worlds = result.brokenWorlds ?? [];
  if (worlds.length === 0 || await confirmAction(brokenWorldsConfirm(input.ap, worlds))) await input.switchTo(result.id);
};

export { finishInstall };
