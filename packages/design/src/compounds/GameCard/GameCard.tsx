/* @layer renderer-app @kind component */
import { Button, ButtonRow, Card, Flex, Stack, Status, Tag, Text } from '@drizztdourden08/tessera/primitives';
import type { GameCardProps } from './GameCard.type';

const GameCard = ({ title, source, status, tag, details, actions }: GameCardProps) => (
  <Card role="group" aria-label={title}>
    <Stack>
      <Flex justify="between" align="center">
        <Text variant="caption">{source}</Text>
        {status && <Status tone={status.tone}>{status.label}</Status>}
        {tag && <Tag>{tag}</Tag>}
      </Flex>
      <Text variant="subtitle">{title}</Text>
      {details.map((line) => <Text key={line} variant="caption">{line}</Text>)}
      <ButtonRow align="start">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.primary ? 'primary' : 'secondary'}
            disabled={action.disabled}
            aria-label={`${action.label} ${title}`}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
      </ButtonRow>
    </Stack>
  </Card>
);

export { GameCard };
