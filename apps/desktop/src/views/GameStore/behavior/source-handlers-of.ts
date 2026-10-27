/* @layer renderer-app @kind logic */
import { openExternal } from '@drizztdourden08/brock-react';
import { appApi } from '../../../ipc/app-api';
import { SEARCHING } from './usePackageSource.constants';
import { plannedStep } from './planned-step';
import { sourceBuildPrepare } from './source-build-prepare';
import { sourceBuildStart } from './source-build-start';
import { sourceCheck } from './source-check';
import { sourcePlan } from './source-plan';
import { sourcePypi } from './source-pypi';
import { sourceSearch } from './source-search';
import { sourceToolInstall } from './source-tool-install';
import { sourceWheel } from './source-wheel';
import type { SourceHandlers, SourceHandlersRun } from './usePackageSource.type';

const cancelBuild = () => { void appApi().sourcesBuildCancel(); };

const cancelTool = () => { void appApi().sourcesToolCancel(); };

const sourceHandlersOf = (run: SourceHandlersRun): SourceHandlers => {
  const { aim, step, results, ask, installWorld, setStep, setResults, close } = run;
  const plan = step.kind === 'plan' ? step : undefined;
  const build = step.kind === 'build' ? step : undefined;
  const check = async () => { if (plan) await sourceCheck({ aim, state: plan, install: installWorld, setStep, close }); };
  const back = () => {
    if (build) {
      cancelBuild();
      setStep(plannedStep(build));
    } else setStep(results ? { kind: 'results', suggestions: results, looking: false } : SEARCHING);
  };
  return {
    onPaste: (paste) => void sourceSearch({ aim, paste, showing: results, setStep, setResults }),
    onPick: (candidate) => setStep({ kind: 'trust', candidate }),
    onTrust: () => { if (step.kind === 'trust') void sourcePlan({ aim, candidate: step.candidate, setStep }); },
    onBack: back,
    onRetry: () => void sourceSearch({ aim, setStep, setResults }),
    onInstallFromPypi: () => { if (plan) void sourcePypi({ aim, state: plan, ask, setStep }).then((done) => (done ? check() : undefined)); },
    onUseWheel: (typed) => { if (plan) void sourceWheel({ aim, state: plan, typed, install: installWorld, setStep, close }); },
    onCheckAgain: () => void check(),
    onBuild: () => { if (plan) setStep({ kind: 'build', candidate: plan.candidate, plan: plan.plan, stage: { kind: 'confirm' } }); },
    onBuildDownload: () => { if (build) void sourceBuildPrepare({ aim, state: build, setStep }); },
    onBuildStart: (made) => { if (build) void sourceBuildStart({ aim, state: build, build: made, install: installWorld, setStep, close }); },
    onBuildCancel: () => {
      cancelBuild();
      if (build) setStep({ ...build, stage: { kind: 'confirm' } });
    },
    onToolInstall: (made, tool) => {
      const stage = build?.stage;
      if (build && stage?.kind === 'missing') void sourceToolInstall({ aim, state: build, build: made, install: installWorld, setStep, close, missing: stage.missing, log: stage.log, tool });
    },
    onToolCancel: cancelTool,
    onOpenLink: openExternal,
    onClose: () => {
      if (build) cancelBuild();
      close();
    },
  };
};

export { sourceHandlersOf };
