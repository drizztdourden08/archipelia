/* @layer renderer-app @kind logic */
import { SELECTOR } from '../review-dom.constants';
import { press } from './press';
import { WIZARD_BUTTON, WIZARD_CHOICE } from './package-wizard.constants';
import type { WizardWalk } from './package-wizard.type';

const pickSource = async (walk: WizardWalk): Promise<boolean> => {
  const picked = await press(walk, 'step', WIZARD_BUTTON.use);
  const trusted = await press(walk, 'step', WIZARD_CHOICE.trust, `${SELECTOR.field}, [role="checkbox"]`);
  walk.tour.check('wizard-pick', picked && trusted, 'a source is picked and trusted', 'the source could not be picked or trusted');
  return picked && trusted;
};

export { pickSource };
