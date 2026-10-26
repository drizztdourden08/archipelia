/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import type { PackageSourceDialogProps, PackageSourceStep } from '@archipelia/design';
import type { SourceSuggestions } from '@archipelia/model';
import type { GameRow } from '../GameStore.type';
import { sourceAimOf } from './source-aim-of';
import { sourceHandlersOf } from './source-handlers-of';
import { sourceSearch } from './source-search';
import { SEARCHING } from './usePackageSource.constants';
import type { PackageSourceParams, SourceAim } from './usePackageSource.type';

const usePackageSource = ({ needOf, installWorld, ask }: PackageSourceParams) => {
  const [aim, setAim] = useState<SourceAim | null>(null);
  const [step, setStep] = useState<PackageSourceStep>(SEARCHING);
  const [results, setResults] = useState<SourceSuggestions | null>(null);

  const close = useCallback(() => { setAim(null); setResults(null); setStep(SEARCHING); }, []);
  const open = useCallback((row: GameRow) => {
    const target = sourceAimOf(row, needOf(row.entry.apworld));
    if (!target) return;
    setAim(target);
    setResults(null);
    void sourceSearch({ aim: target, setStep, setResults });
  }, [needOf]);

  const dialog: PackageSourceDialogProps | null = aim && {
    title: aim.title,
    module: aim.module,
    step,
    ...sourceHandlersOf({ aim, step, results, ask, installWorld, setStep, setResults, close }),
  };

  return { dialog, open };
};

export { usePackageSource };
