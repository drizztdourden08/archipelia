/* @layer renderer-app @kind logic */
import { SELECTOR } from '../review-dom.constants';
import { WIZARD_BUTTON, WIZARD_TEXT } from './package-wizard.constants';
import type { WizardWalk } from './package-wizard.type';
import { pickSource } from './pick-source';
import { press } from './press';
import { showStep } from './show-step';

const walkStart = async (walk: WizardWalk, how: RegExp): Promise<void> => {
  await showStep(walk, 'why', WIZARD_TEXT.why);
  await press(walk, 'nav', WIZARD_BUTTON.next);
  await showStep(walk, 'source', WIZARD_TEXT.source);
  await pickSource(walk);
  await walk.tour.capture('source-picked');
  await press(walk, 'nav', WIZARD_BUTTON.next);
  await showStep(walk, 'found', WIZARD_TEXT.found);
  await press(walk, 'nav', WIZARD_BUTTON.next);
  await showStep(walk, 'how', WIZARD_TEXT.how);
  await press(walk, 'step', how, SELECTOR.radio);
  await press(walk, 'nav', WIZARD_BUTTON.next);
};

export { walkStart };
