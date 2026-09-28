/* @layer renderer-app @kind component */
import { Badge, Button, ButtonRow, Card, Flex, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { GameCardProps } from './GameCard.type';

const GameCard = ({ title, source, badge, details, actions }: GameCardProps) => (
  <Card role="group" aria-label={title}>
    <Stack>
      <Flex justify="between" align="center">
        <Text variant="caption">{source}</Text>
        {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
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
