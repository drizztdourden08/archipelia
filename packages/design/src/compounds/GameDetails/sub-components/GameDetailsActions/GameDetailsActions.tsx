/* @layer renderer-app @kind component */
import { Button, Flex, Icon, Spinner, Text } from '@drizztdourden08/tessera/primitives';
import { BUTTON_VARIANT } from '../../GameDetails.constants';
import type { GameDetailsActionsProps } from './GameDetailsActions.type';

const GameDetailsActions = ({ actions, busy }: GameDetailsActionsProps) => {
  if (busy) return <Flex align="center" gap="sm"><Spinner size="sm" label={busy} /><Text>{busy}</Text></Flex>;
  return (
    <Flex gap="sm" wrap>
      {actions.map((action) => (
        <Button key={action.id} variant={BUTTON_VARIANT[action.primary ? 'primary' : action.tone ?? 'default']} icon={<Icon name={action.icon} />} disabled={action.disabled} loading={action.loading} onClick={action.onClick}>
          {action.label}
        </Button>
      ))}
    </Flex>
  );
};

export { GameDetailsActions };
