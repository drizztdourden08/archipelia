/* @layer renderer-app @kind component */
import { Flex, Tag, Text } from '@drizztdourden08/tessera/primitives';
import { VERSION_TEXT } from '../../GameDetails.constants';
import type { VersionRowProps } from './VersionRow.type';

const VersionRow = ({ label, version }: VersionRowProps) => (
  <Flex align="center" gap="sm" wrap>
    <Text mono>{label}</Text>
    {version?.prerelease && <Tag>{VERSION_TEXT.prerelease}</Tag>}
    {version?.note && <Text variant="caption" tone="dim">{version.note}</Text>}
    {version?.reason && <Text variant="caption" tone="dim">{version.reason}</Text>}
  </Flex>
);

export { VersionRow };
