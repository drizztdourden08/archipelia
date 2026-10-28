/* @layer renderer-app @kind component */
import { Flex, Icon, Tag } from '@drizztdourden08/tessera/primitives';
import type { DirectWorldsProps } from './DirectWorlds.type';

const DirectWorlds = ({ worlds, allowUnlisted }: DirectWorldsProps) => (
  <Flex gap="xs" wrap>
    {worlds.map(({ game, listed }) => (
      <Tag key={game} variant="urgency" color={listed || allowUnlisted ? 'info' : 'warning'}>
        <Icon name={listed || allowUnlisted ? 'plug-zap' : 'triangle-alert'} size={12} />{game}
      </Tag>
    ))}
  </Flex>
);

export { DirectWorlds };
