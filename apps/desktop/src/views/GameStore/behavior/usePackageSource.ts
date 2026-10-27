/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import type { PackageSourceDialogProps, PackageSourceStep, SourceSearch } from '@archipelia/design';
import type { GameRow } from '../GameStore.type';
import { finishViewOf } from './finish-view-of';
import { sourceAimOf } from './source-aim-of';
import { sourceHandlersOf } from './source-handlers-of';
import { sourceSearch } from './source-search';
import { useBuildLog } from './useBuildLog';
import { FINISH, FIRST_SEARCH, IDLE } from './usePackageSource.constants';
import type { FinishState, PackageSourceParams, SourceAim } from './usePackageSource.type';

const usePackageSource = ({ needOf, errorOf, installWorld, consent }: PackageSourceParams) => {
  const [aim, setAim] = useState<SourceAim | null>(null);
  const [search, setSearch] = useState<SourceSearch>(FIRST_SEARCH);
  const [step, setStep] = useState<PackageSourceStep>(IDLE);
  const [finish, setFinish] = useState<FinishState>(FINISH.idle);
  const buildLog = useBuildLog();

  const reset = useCallback((target: SourceAim | null) => {
    setAim(target);
    setSearch(FIRST_SEARCH);
    setStep(IDLE);
    setFinish(FINISH.idle);
  }, []);
  const close = useCallback(() => reset(null), [reset]);
  const open = useCallback((row: GameRow) => {
    const target = sourceAimOf(row, needOf(row.entry.apworld));
    if (!target) return;
    reset(target);
    void sourceSearch({ aim: target, search: FIRST_SEARCH, setSearch });
  }, [needOf, reset]);

  const dialog: PackageSourceDialogProps | null = aim && {
    title: aim.title,
    module: aim.module,
    search,
    step,
    finish: finishViewOf(finish, aim, { needOf, errorOf }),
    consent: consent.pending,
    buildLog,
    ...sourceHandlersOf({ aim, step, search, consent, installWorld, setStep, setSearch, setFinish, close }),
  };

  return { dialog, open };
};

export { usePackageSource };
