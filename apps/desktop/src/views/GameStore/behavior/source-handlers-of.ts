/* @layer renderer-app @kind logic */
import { openExternal } from '@drizztdourden08/brock-react';
import { SEARCHING } from './usePackageSource.constants';
import { sourceCheck } from './source-check';
import { sourcePlan } from './source-plan';
import { sourcePypi } from './source-pypi';
import { sourceSearch } from './source-search';
import { sourceWheel } from './source-wheel';
import type { SourceHandlers, SourceHandlersRun } from './usePackageSource.type';

const sourceHandlersOf = (run: SourceHandlersRun): SourceHandlers => {
  const { aim, step, results, ask, installWorld, setStep, setResults, close } = run;
  const plan = step.kind === 'plan' ? step : undefined;
  const check = async () => { if (plan) await sourceCheck({ aim, state: plan, install: installWorld, setStep, close }); };
  return {
    onPaste: (paste) => void sourceSearch({ aim, paste, showing: results, setStep, setResults }),
    onPick: (candidate) => setStep({ kind: 'trust', candidate }),
    onTrust: () => { if (step.kind === 'trust') void sourcePlan({ aim, candidate: step.candidate, setStep }); },
    onBack: () => setStep(results ? { kind: 'results', suggestions: results, looking: false } : SEARCHING),
    onRetry: () => void sourceSearch({ aim, setStep, setResults }),
    onInstallFromPypi: () => { if (plan) void sourcePypi({ aim, state: plan, ask, setStep }).then((done) => (done ? check() : undefined)); },
    onUseWheel: (typed) => { if (plan) void sourceWheel({ aim, state: plan, typed, install: installWorld, setStep, close }); },
    onCheckAgain: () => void check(),
    onOpenLink: openExternal,
    onClose: close,
  };
};

export { sourceHandlersOf };
