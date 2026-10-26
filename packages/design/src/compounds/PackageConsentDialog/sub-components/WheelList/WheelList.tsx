/* @layer renderer-app @kind component */
import { Box, Link, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { CONSENT_TEXT } from '../../PackageConsentDialog.constants';
import type { WheelListProps } from '../../PackageConsentDialog.type';

const WheelList = ({ heading, wheels, onOpenLink }: WheelListProps) => {
  if (wheels.length === 0) return null;
  return (
    <Stack gap="xs" as="section" aria-label={heading}>
      <Text variant="caption" tone="dim">{heading}</Text>
      <Stack gap="sm" as="ul" className="package-consent__list">
        {wheels.map((wheel) => (
          <Box as="li" key={wheel.sha256}>
            <Link href={`https://github.com/${wheel.repo}/releases/tag/${encodeURIComponent(wheel.tag)}`} external navigate={onOpenLink}>
              {`${wheel.name} ${wheel.version}`}
            </Link>
            <Text>{CONSENT_TEXT.wheelFrom(wheel.tag, wheel.repo)}</Text>
            <Text mono variant="caption" tone="dim">{CONSENT_TEXT.wheelDigest(wheel.sha256)}</Text>
            <Text variant="caption" tone={wheel.verified ? 'dim' : 'warning'}>{wheel.verified ? CONSENT_TEXT.wheelChecked : CONSENT_TEXT.wheelUnchecked}</Text>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};

export { WheelList };
