/* @layer renderer-app @kind logic */
import { waitText } from '../wait-text';
import type { WizardWalk } from './package-wizard.type';

const showStep = async ({ tour, root }: WizardWalk, name: string, text: RegExp): Promise<boolean> => {
  const shown = await waitText(tour, text, root, 6000);
  tour.check(`wizard-${name}`, shown, `the ${name} step shows its content`, `the ${name} step never showed ${String(text)}`);
  await tour.capture(name);
  return shown;
};

export { showStep };
