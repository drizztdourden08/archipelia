/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import { PackageConsentBody } from '../../../PackageConsentDialog';
import { STEP_TEXT } from '../../behavior/step-text.constants';
import type { StepBodyProps } from '../../PackageSourceDialog.type';
import { SourceBusy } from '../SourceBusy';

const ConsentStep = ({ dialog }: StepBodyProps) => {
  const { consent, finish } = dialog;
  if (consent) return <PackageConsentBody title={dialog.title} packages={consent.packages} wheels={consent.wheels} onOpenLink={dialog.onOpenLink} />;
  if (finish.kind === 'running') return <SourceBusy text={STEP_TEXT.consentWait} />;
  return <Text>{finish.kind === 'done' ? STEP_TEXT.consentDone : STEP_TEXT.consentWait}</Text>;
};

export { ConsentStep };
