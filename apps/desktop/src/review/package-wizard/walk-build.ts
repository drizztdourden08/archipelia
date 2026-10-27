/* @layer renderer-app @kind logic */
import { WIZARD_BUTTON, WIZARD_CHOICE, WIZARD_TEXT } from './package-wizard.constants';
import type { WizardWalk } from './package-wizard.type';
import { press } from './press';
import { showStep } from './show-step';
import { walkStart } from './walk-start';

const walkBuild = async (walk: WizardWalk): Promise<void> => {
  await walkStart(walk, WIZARD_CHOICE.build);
  await showStep(walk, 'confirm', WIZARD_TEXT.confirm);
  await press(walk, 'nav', /^Download the source$/);
  await showStep(walk, 'tools', WIZARD_TEXT.tools);
  await press(walk, 'nav', /^Check and build$/);
  await showStep(walk, 'tool-missing', WIZARD_TEXT.toolMissing);
  await press(walk, 'step', WIZARD_BUTTON.installForMe);
  await showStep(walk, 'tool-install', WIZARD_TEXT.toolInstall);
  await press(walk, 'step', WIZARD_BUTTON.install);
  await showStep(walk, 'tool-running', WIZARD_TEXT.toolRunning);
  await showStep(walk, 'consent', WIZARD_TEXT.consent);
  await press(walk, 'nav', WIZARD_BUTTON.install);
  await showStep(walk, 'done', WIZARD_TEXT.done);
  await press(walk, 'nav', WIZARD_BUTTON.done);
};

export { walkBuild };
