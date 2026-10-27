/* @layer renderer-app @kind logic */
import { SELECTOR } from '../review-dom.constants';
import { waitNamed } from '../wait-named';
import { WIZARD_SCOPE } from './package-wizard.constants';
import type { WizardScope, WizardWalk } from './package-wizard.type';

const press = async ({ tour, root }: WizardWalk, scope: WizardScope, name: string | RegExp, selector: string = SELECTOR.button): Promise<boolean> => {
  const area = root()?.querySelector(WIZARD_SCOPE[scope]) ?? undefined;
  const target = await waitNamed(tour, selector, name, area ?? undefined);
  if (target) tour.click(target);
  await tour.settle();
  return target !== null;
};

export { press };
