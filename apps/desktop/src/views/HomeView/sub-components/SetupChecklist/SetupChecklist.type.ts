/* @layer renderer-app @kind types */
import type { HomeStep } from '../../HomeView.type';

type SetupChecklistProps = { steps: readonly HomeStep[]; onStep: (id: string) => void };

export type { SetupChecklistProps };
