/* @layer renderer-app @kind types */
import type { AppReviewTour } from '@drizztdourden08/brock-react';

type WizardWalk = { tour: AppReviewTour; root: () => HTMLElement | null };

type MountedWizard = { close: () => void; closed: () => boolean };

type WizardScope = 'step' | 'nav';

export type { MountedWizard, WizardScope, WizardWalk };
