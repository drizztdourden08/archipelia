/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { confirmDelete, useJob, useKeyedGuard } from '@drizztdourden08/brock-react';
import type { InstalledEngine } from '@archipelia/model';
import { failWith } from '../../../hooks/fail-with';
import { useLoggedFailure } from '../../../hooks/useLoggedFailure';
import { ENGINE_JOB } from '../../../jobs/jobs.constants';
import { useEngineStore } from '../../../stores/useEngineStore';
import { FAILURE } from '../EngineSettings.constants';
import type { Picked } from '../EngineSettings.type';
import { choicePlan } from './choice-plan';
import { chosenVersions } from './chosen-versions';
import { engineActions } from './engine-actions';
import { engineView } from './engine-view';
import { finishInstall } from './finish-install';
import { removeEngineConfirm } from './remove-engine-confirm';
import { setupProgress } from './setup-progress';

const useEngineSettings = () => {
  const { status, overview, refresh, setup, load, install, switchTo, remove } = useEngineStore();
  const { job, open } = useJob(ENGINE_JOB);
  const { guard, isBusy, lastError } = useKeyedGuard();
  const [picked, setPicked] = useState<Picked>({});

  useEffect(() => {
    void refresh();
    void guard('load', failWith(FAILURE.overview, () => load()));
  }, [refresh, load, guard]);

  const view = engineView(status);
  const failure = useLoggedFailure(view.error, FAILURE.setup);
  const chosen = useMemo(() => chosenVersions(overview, picked), [overview, picked]);
  const plan = useMemo(() => choicePlan(overview, chosen), [overview, chosen]);
  const busy = view.building || isBusy('apply') || isBusy('remove');
  const actions = useMemo(
    () => engineActions({ ready: view.ready, building: view.building, setup, refresh, showProgress: job ? open : undefined }),
    [view.ready, view.building, setup, refresh, job, open],
  );

  const pickAp = useCallback((ap: string) => setPicked((current) => ({ ...current, ap })), []);
  const pickPython = useCallback((python: string) => setPicked((current) => ({ ...current, python })), []);
  const check = useCallback(() => { void guard('check', failWith(FAILURE.overview, () => load(true))); }, [guard, load]);

  const apply = useCallback(() => {
    if (plan.kind === 'none') return;
    void guard('apply', failWith(FAILURE.apply, async () => {
      if (plan.kind === 'switch') await switchTo(plan.id);
      else await finishInstall(await install(plan.choice), { ap: plan.choice.ap, switchTo });
    }));
  }, [guard, plan, switchTo, install]);

  const switchEngine = useCallback((id: string) => { void guard('apply', failWith(FAILURE.apply, () => switchTo(id))); }, [guard, switchTo]);

  const removeEngine = useCallback((engine: InstalledEngine) => {
    void confirmDelete(removeEngineConfirm(engine)).then((confirmed) => (
      confirmed ? guard('remove', failWith(FAILURE.remove, () => remove(engine.id))) : undefined
    ));
  }, [guard, remove]);

  return {
    overview, chosen, plan, busy, lastError, view, failure, actions, progress: setupProgress(job),
    checking: isBusy('check'),
    pickAp, pickPython, check, apply, switchEngine, removeEngine,
  };
};

export { useEngineSettings };
