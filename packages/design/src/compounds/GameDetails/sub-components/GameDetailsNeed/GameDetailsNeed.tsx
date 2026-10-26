/* @layer renderer-app @kind component */
import { Box, Button, Callout, Icon } from '@drizztdourden08/tessera/primitives';
import type { GameDetailsNeedProps } from './GameDetailsNeed.type';

const GameDetailsNeed = ({ message, href, onLink }: GameDetailsNeedProps) => {
  const open = href && onLink && <Button size="sm" variant="secondary" icon={<Icon name="external-link" />} onClick={() => onLink(href)}>Open on GitHub</Button>;
  return <Box role="status"><Callout tone="warning" action={open}>{message}</Callout></Box>;
};

export { GameDetailsNeed };
