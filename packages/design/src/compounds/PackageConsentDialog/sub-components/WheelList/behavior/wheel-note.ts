/* @layer renderer-app @kind logic */
import type { ConsentWheel } from '../../../PackageConsentDialog.type';
import { CONSENT_TEXT } from '../../../PackageConsentDialog.constants';

const wheelNote = ({ built, verified }: ConsentWheel): { text: string; tone: 'dim' | 'warning' } => {
  if (built === true) return { text: CONSENT_TEXT.wheelBuiltNote, tone: 'dim' };
  return verified ? { text: CONSENT_TEXT.wheelChecked, tone: 'dim' } : { text: CONSENT_TEXT.wheelUnchecked, tone: 'warning' };
};

export { wheelNote };
