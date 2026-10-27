/* @layer renderer-app @kind component */
import { DialogShell } from '@drizztdourden08/tessera/composites';
import { Button, Flex, Icon } from '@drizztdourden08/tessera/primitives';
import { CONSENT_TEXT } from './PackageConsentDialog.constants';
import type { PackageConsentDialogProps } from './PackageConsentDialog.type';
import { PackageConsentBody } from './sub-components/PackageConsentBody';
import './PackageConsentDialog.css';

const PackageConsentDialog = ({ title, packages, wheels = [], onAccept, onCancel, onOpenLink }: PackageConsentDialogProps) => (
  <DialogShell
    open
    size="md"
    onClose={onCancel}
    title={`Install packages for ${title}`}
    actions={(
      <Flex gap="sm" justify="end" wrap>
        <Button variant="secondary" onClick={onCancel}>{CONSENT_TEXT.cancel}</Button>
        <Button variant="primary" icon={<Icon name="download" />} onClick={onAccept}>{CONSENT_TEXT.accept}</Button>
      </Flex>
    )}
  >
    <PackageConsentBody title={title} packages={packages} wheels={wheels} onOpenLink={onOpenLink} />
  </DialogShell>
);

export { PackageConsentDialog };
