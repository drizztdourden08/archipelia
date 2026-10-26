/* @layer renderer-app @kind component */
import { Box, Link, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { wheelLink } from './behavior/wheel-link';
import { wheelNote } from './behavior/wheel-note';
import { CONSENT_TEXT } from '../../PackageConsentDialog.constants';
import type { WheelListProps } from '../../PackageConsentDialog.type';

const WheelList = ({ heading, wheels, onOpenLink }: WheelListProps) => {
  if (wheels.length === 0) return null;
  return (
    <Stack gap="xs" as="section" aria-label={heading}>
      <Text variant="caption" tone="dim">{heading}</Text>
      <Stack gap="sm" as="ul" className="package-consent__list">
        {wheels.map((wheel) => {
          const note = wheelNote(wheel);
          return (
            <Box as="li" key={wheel.sha256}>
              <Link href={wheelLink(wheel)} external navigate={onOpenLink}>
                {`${wheel.name} ${wheel.version}`}
              </Link>
              <Text>{wheel.built === true ? CONSENT_TEXT.wheelBuilt(wheel.repo, (wheel.commit ?? wheel.tag).slice(0, 7)) : CONSENT_TEXT.wheelFrom(wheel.tag, wheel.repo)}</Text>
              {wheel.built === true && wheel.archiveSha256 && <Text mono variant="caption" tone="dim">{CONSENT_TEXT.wheelArchive(wheel.archiveSha256)}</Text>}
              {wheel.newest && <Text variant="caption" tone="warning">{CONSENT_TEXT.wheelOlder(wheel.newest, wheel.tag)}</Text>}
              <Text mono variant="caption" tone="dim">{CONSENT_TEXT.wheelDigest(wheel.sha256)}</Text>
              <Text variant="caption" tone={note.tone}>{note.text}</Text>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
};

export { WheelList };
