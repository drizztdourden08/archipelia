/* @layer renderer-app @kind component */
import { DialogShell } from '@drizztdourden08/tessera/composites';
import { Button, Flex, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { CONSENT_TEXT } from './PackageConsentDialog.constants';
import type { PackageConsentDialogProps } from './PackageConsentDialog.type';
import { PackageList } from './sub-components/PackageList';
import './PackageConsentDialog.css';

const PackageConsentDialog = ({ title, packages, onAccept, onCancel, onOpenLink }: PackageConsentDialogProps) => (
  <DialogShell
    open
    onClose={onCancel}
    title={`Install packages for ${title}`}
    actions={(
      <Flex gap="sm" justify="end" wrap>
        <Button variant="secondary" onClick={onCancel}>{CONSENT_TEXT.cancel}</Button>
        <Button variant="primary" icon={<Icon name="download" />} onClick={onAccept}>{CONSENT_TEXT.accept}</Button>
      </Flex>
    )}
  >
    <Stack gap="md">
      <Text>{CONSENT_TEXT.intro(title)}</Text>
      <PackageList heading={CONSENT_TEXT.direct(title)} packages={packages.filter((entry) => entry.direct)} onOpenLink={onOpenLink} />
      <PackageList heading={CONSENT_TEXT.dependencies} packages={packages.filter((entry) => !entry.direct)} onOpenLink={onOpenLink} />
    </Stack>
  </DialogShell>
);

export { PackageConsentDialog };
