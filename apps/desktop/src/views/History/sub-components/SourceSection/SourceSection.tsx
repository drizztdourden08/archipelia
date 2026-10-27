/* @layer renderer-app @kind component */
import { Button, Flex, Icon, Tag, Text } from '@drizztdourden08/tessera/primitives';
import { UNKNOWN_SOURCE_NAME } from '@archipelia/model';
import { TEXT } from '../../History.constants';
import { DetailSection } from '../DetailSection';
import type { SourceSectionProps } from './SourceSection.type';

const SourceSection = ({ link, chip, onOpen }: SourceSectionProps) => (
  <DetailSection title="Source">
    <Flex align="center" gap="sm" wrap>
      {link.sessionId
        ? <Button size="sm" variant="ghost" iconEnd={<Icon name="chevron-right" />} aria-label={`Open session ${link.name}`} onClick={() => onOpen(link.sessionId ?? '')}>{link.name}</Button>
        : <Text variant="body">{TEXT.sessionDeleted}</Text>}
      {!link.sessionId && link.name !== UNKNOWN_SOURCE_NAME && <Text variant="caption">Was {link.name}</Text>}
      <Tag color={chip.recorded ? 'secondary' : 'neutral'}>{chip.text}</Tag>
    </Flex>
  </DetailSection>
);

export { SourceSection };
