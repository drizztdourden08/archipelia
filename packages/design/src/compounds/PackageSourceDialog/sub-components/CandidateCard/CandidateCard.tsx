/* @layer renderer-app @kind component */
import { Button, Card, Flex, Icon, Stack, Tag, Text } from '@drizztdourden08/tessera/primitives';
import { DateText } from '@drizztdourden08/tessera/composites';
import { ORIGIN_LABEL, SOURCE_TEXT, WARNING_LABEL } from '../../PackageSourceDialog.constants';
import type { CandidateCardProps } from '../../PackageSourceDialog.type';

const CandidateCard = ({ module, candidate, onPick, onOpenLink }: CandidateCardProps) => {
  const { id, url, description, stars, pushedAt, createdAt, contains, origins, warnings } = candidate;
  return (
    <Card
      className="package-source__card"
      data-muted={contains ? undefined : ''}
      title={<Text variant="title" mono>{id}</Text>}
      subtitle={description}
      actions={(
        <Flex gap="sm" wrap>
          <Button size="sm" variant="secondary" icon={<Icon name="external-link" />} onClick={() => onOpenLink(url)}>{SOURCE_TEXT.openRepo}</Button>
          <Button size="sm" variant="primary" disabled={!contains} onClick={() => onPick(candidate)}>{SOURCE_TEXT.use}</Button>
        </Flex>
      )}
    >
      <Stack gap="sm">
        <Flex gap="xs" wrap>
          <Tag variant="urgency" color={contains ? 'success' : 'warning'}>{contains ? SOURCE_TEXT.contains(module) : SOURCE_TEXT.missingModule(module)}</Tag>
          {origins.map((origin) => ORIGIN_LABEL[origin] && <Tag key={origin} color="primary">{ORIGIN_LABEL[origin]}</Tag>)}
          {warnings.map((warning) => <Tag key={warning} variant="urgency" color="warning">{WARNING_LABEL[warning]}</Tag>)}
        </Flex>
        <Flex gap="md" wrap>
          <Text variant="caption" tone="dim">{SOURCE_TEXT.stars(stars)}</Text>
          {pushedAt && <Text variant="caption" tone="dim">{SOURCE_TEXT.updated} <DateText value={pushedAt} format="date" /></Text>}
          {createdAt && <Text variant="caption" tone="dim">{SOURCE_TEXT.created} <DateText value={createdAt} format="date" /></Text>}
        </Flex>
      </Stack>
    </Card>
  );
};

export { CandidateCard };
