/* @layer renderer-app @kind logic */
import { defineReviewStep } from '@drizztdourden08/brock-react';
import { mountWizard } from './package-wizard/mount-wizard';
import { walkBuild } from './package-wizard/walk-build';
import { walkMyself } from './package-wizard/walk-myself';
import { wizardRoot } from './package-wizard/wizard-root';
import { SELECTOR } from './review-dom.constants';
import { waitText } from './wait-text';
import { WIZARD_TITLE } from './package-wizard/package-wizard.constants';

export default defineReviewStep({
  run: async (tour) => {
    for (const walk of [walkBuild, walkMyself]) {
      const mounted = mountWizard();
      const root = wizardRoot(tour);
      const opened = await waitText(tour, WIZARD_TITLE, root);
      if (!opened) await tour.capture('not-opened');
      tour.check('wizard-opens', opened, 'the Get the package wizard opens on a mocked world', `the wizard never opened, dialogs: ${tour.findAll(SELECTOR.dialog).map((el) => el.innerText.slice(0, 60)).join(' | ')}`);
      if (opened) await walk({ tour, root });
      mounted.close();
    }
  },
});
