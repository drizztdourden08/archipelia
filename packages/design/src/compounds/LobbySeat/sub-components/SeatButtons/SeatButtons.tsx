/* @layer renderer-app @kind component */
import { Button, Flex, Icon, IconButton } from '@drizztdourden08/tessera/primitives';
import type { LobbySeatAction } from '../../LobbySeat.type';
import type { SeatButtonsProps } from './SeatButtons.type';

const nameOf = ({ label, nameSuffix }: LobbySeatAction): string => (nameSuffix ? `${label} ${nameSuffix}` : label);

const SeatButtons = ({ actions, iconOnly = false, className }: SeatButtonsProps) => {
  if (actions.length === 0) return null;
  return (
    <Flex className={className} gap="xs" align="center" wrap>
      {actions.map((action) => (iconOnly
        ? (
          <IconButton key={action.id} size="sm" variant="ghost" label={nameOf(action)} disabled={action.disabled} onClick={action.onSelect}>
            <Icon name={action.icon ?? 'ellipsis'} />
          </IconButton>
        )
        : (
          <Button
            key={action.id}
            size="sm"
            variant={action.primary ? 'primary' : 'secondary'}
            icon={action.icon ? <Icon name={action.icon} /> : undefined}
            aria-label={nameOf(action)}
            disabled={action.disabled}
            onClick={action.onSelect}
          >
            {action.label}
          </Button>
        )))}
    </Flex>
  );
};

export { SeatButtons };
