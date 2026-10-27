/* @layer renderer-app @kind logic */
import { openExternal } from '@drizztdourden08/brock-react';
import { appApi } from '../../../ipc/app-api';
import { cancelledStep } from './cancelled-step';
import { finishingOf } from './finishing';
import { sourceBuildPrepare } from './source-build-prepare';
import { sourceBuildStart } from './source-build-start';
import { sourceCheck } from './source-check';
import { sourcePlan } from './source-plan';
import { sourcePypi } from './source-pypi';
import { sourceSearch } from './source-search';
import { sourceToolInstall } from './source-tool-install';
import { sourceWheel } from './source-wheel';
import { FINISH } from './usePackageSource.constants';
import type { SourceHandlers, SourceHandlersRun } from './usePackageSource.type';

const cancelBuild = () => { void appApi().sourcesBuildCancel(); };

const cancelTool = () => { void appApi().sourcesToolCancel(); };

const sourceHandlersOf = (run: SourceHandlersRun): SourceHandlers => {
  const { aim, step, search, consent, installWorld, setStep, setSearch, setFinish, close } = run;
  const planned = step.kind === 'plan' || step.kind === 'build' ? step : undefined;
  const build = step.kind === 'build' ? step : undefined;
  const common = { aim, install: installWorld, finishing: finishingOf(setFinish) };
  return {
    onPaste: (paste) => void sourceSearch({ aim, paste, search, setSearch }),
    onRetrySearch: () => void sourceSearch({ aim, search, setSearch }),
    onPlan: (candidate) => {
      setFinish(FINISH.idle);
      void sourcePlan({ aim, candidate, setStep });
    },
    onInstallFromPypi: () => { if (planned) void sourcePypi({ ...common, state: planned, ask: consent.ask }); },
    onUseWheel: (typed) => { if (planned) void sourceWheel({ ...common, state: planned, typed }); },
    onCheckAgain: () => void sourceCheck(common),
    onBuildDownload: () => { if (planned) void sourceBuildPrepare({ aim, state: planned, setStep }); },
    onBuildStart: (made) => { if (build) void sourceBuildStart({ ...common, state: build, build: made, setStep }); },
    onBuildCancel: () => {
      cancelBuild();
      setStep(cancelledStep(step));
    },
    onToolInstall: (made, tool) => {
      const stage = build?.stage;
      if (build && stage?.kind === 'missing') void sourceToolInstall({ ...common, state: build, build: made, setStep, missing: stage.missing, log: stage.log, tool });
    },
    onToolCancel: cancelTool,
    onConsent: (accepted) => (accepted ? consent.accept() : consent.cancel()),
    onOpenLink: openExternal,
    onClose: () => {
      if (build) cancelBuild();
      consent.cancel();
      close();
    },
  };
};

export { sourceHandlersOf };
