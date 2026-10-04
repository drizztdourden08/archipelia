/* @layer renderer-app @kind types */
import type { HomeStep } from '../../HomeView.type';

type SetupStepRowProps = { step: HomeStep; index: number; onStep: (id: string) => void };

export type { SetupStepRowProps };
