/* @layer renderer-app @kind component */
import { Box, Link, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { PackageListProps } from '../../PackageConsentDialog.type';

const PackageList = ({ heading, packages, onOpenLink }: PackageListProps) => {
  if (packages.length === 0) return null;
  return (
    <Stack gap="xs" as="section" aria-label={heading}>
      <Text variant="caption" tone="dim">{heading}</Text>
      <Stack gap="xs" as="ul" className="package-consent__list">
        {packages.map((entry) => (
          <Box as="li" key={`${entry.name}==${entry.version}`}>
            <Link href={entry.url} external navigate={onOpenLink}>{`${entry.name} ${entry.version}`}</Link>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};

export { PackageList };
