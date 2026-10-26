/* @layer renderer-app @kind component */
import { Flex, Icon, Text } from '@drizztdourden08/tessera/primitives';
import { NONE_INSTALLED, SECTIONS } from '../../GameStore.constants';
import type { SectionLabelProps } from './SectionLabel.type';

const SectionLabel = ({ id, empty }: SectionLabelProps) => {
  const meta = SECTIONS.find((entry) => entry.id === id);
  if (!meta) return null;
  return (
    <Flex as="span" align="center" gap="xs" inline>
      <Icon name={meta.icon} size={14} />
      {meta.title}
      {empty && <Text as="span" variant="caption" tone="dim">{NONE_INSTALLED}</Text>}
    </Flex>
  );
};

export { SectionLabel };
