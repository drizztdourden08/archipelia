/* @layer renderer-app @kind component */
import { Button, Card, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { StatCardProps } from './StatCard.type';
import './StatCard.css';

const StatCard = ({ heading, value, meta, action }: StatCardProps) => (
  <Card className="stat-card">
    <Stack gap="xs">
      <Text variant="label" className="stat-card__heading">{heading}</Text>
      <Text variant="title" className="stat-card__value">{value}</Text>
      {meta && <Text variant="caption">{meta}</Text>}
      {action && (
        <Button size="sm" variant={action.primary ? 'primary' : 'secondary'} onClick={action.onClick}>{action.label}</Button>
      )}
    </Stack>
  </Card>
);

export { StatCard };
