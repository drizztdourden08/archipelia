/* @layer renderer-app @kind logic */
import { WIZARD_BUTTON, WIZARD_CHOICE, WIZARD_TEXT } from './package-wizard.constants';
import type { WizardWalk } from './package-wizard.type';
import { press } from './press';
import { showStep } from './show-step';
import { walkStart } from './walk-start';

const walkMyself = async (walk: WizardWalk): Promise<void> => {
  await walkStart(walk, WIZARD_CHOICE.myself);
  await showStep(walk, 'compiler', WIZARD_TEXT.compiler);
  await press(walk, 'nav', WIZARD_BUTTON.next);
  await showStep(walk, 'git', WIZARD_TEXT.git);
  await press(walk, 'nav', WIZARD_BUTTON.next);
  await showStep(walk, 'pip', WIZARD_TEXT.pip);
  await press(walk, 'nav', WIZARD_BUTTON.next);
  await showStep(walk, 'check', WIZARD_TEXT.check);
  await press(walk, 'step', WIZARD_BUTTON.checkAgain);
  await showStep(walk, 'check-missing', WIZARD_TEXT.stillMissing);
  await press(walk, 'nav', WIZARD_BUTTON.cancel);
};

export { walkMyself };
