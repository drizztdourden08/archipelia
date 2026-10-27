/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera/primitives';
import { CONSENT_TEXT } from '../../PackageConsentDialog.constants';
import type { PackageConsentBodyProps } from '../../PackageConsentDialog.type';
import { PackageList } from '../PackageList';
import { WheelList } from '../WheelList';

const PackageConsentBody = ({ title, packages, wheels = [], onOpenLink }: PackageConsentBodyProps) => (
  <Stack gap="md">
    <Text>{CONSENT_TEXT.intro(title)}</Text>
    <PackageList heading={CONSENT_TEXT.direct(title)} packages={packages.filter((entry) => entry.direct)} onOpenLink={onOpenLink} />
    <WheelList heading={CONSENT_TEXT.wheels} wheels={wheels} onOpenLink={onOpenLink} />
    <PackageList heading={CONSENT_TEXT.dependencies} packages={packages.filter((entry) => !entry.direct)} onOpenLink={onOpenLink} />
  </Stack>
);

export { PackageConsentBody };
