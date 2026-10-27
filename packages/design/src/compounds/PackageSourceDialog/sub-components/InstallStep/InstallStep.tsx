/* @layer renderer-app @kind component */
import { Button, Flex, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { PackageConsentBody } from '../../../PackageConsentDialog';
import { failureText } from '../../behavior/failure-text';
import { STEP_TEXT } from '../../behavior/step-text.constants';
import { useStartOnMount } from '../../behavior/useStartOnMount';
import type { StepBodyProps } from '../../PackageSourceDialog.type';
import { RouteFailure } from '../RouteFailure';
import { SourceBusy } from '../SourceBusy';

const InstallStep = (props: StepBodyProps) => {
  const { dialog, view } = props;
  const { consent, finish } = dialog;
  useStartOnMount(view.asking, () => dialog.onConsent(true));
  const problem = failureText(finish);
  if (problem) return <RouteFailure {...props} message={problem} />;
  if (consent) {
    return (
      <Stack gap="md">
        <PackageConsentBody title={dialog.title} packages={consent.packages} wheels={consent.wheels} onOpenLink={dialog.onOpenLink} />
        <Flex gap="sm" wrap>
          <Button variant="primary" icon={<Icon name="download" />} onClick={() => dialog.onConsent(true)}>{STEP_TEXT.consentButton}</Button>
          <Button variant="secondary" onClick={() => dialog.onConsent(false)}>{STEP_TEXT.cancel}</Button>
        </Flex>
      </Stack>
    );
  }
  if (finish.kind === 'running') return <SourceBusy text={STEP_TEXT.installBusy(dialog.module)} />;
  return <Text>{finish.kind === 'done' ? STEP_TEXT.installDone(dialog.module) : STEP_TEXT.installIdle}</Text>;
};

export { InstallStep };
