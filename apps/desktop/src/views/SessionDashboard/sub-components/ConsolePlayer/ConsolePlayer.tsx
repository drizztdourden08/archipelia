/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Button, ButtonRow } from '@drizztdourden08/tessera/primitives';
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import type { ConsolePlayerProps } from './ConsolePlayer.type';

const ConsolePlayer = ({ name, onConfirm }: ConsolePlayerProps) => {
  const release = useCallback(
    () => onConfirm(`/release ${name}`, `Release ${name}`, `Every item still in ${name}'s world is sent to its owner.`),
    [name, onConfirm],
  );
  const collect = useCallback(
    () => onConfirm(`/collect ${name}`, `Collect for ${name}`, `Every item of ${name} still in other worlds is sent to ${name}.`),
    [name, onConfirm],
  );
  const actions = (
    <ButtonRow gap="xs">
      <Button size="sm" variant="ghost" aria-label={`Release ${name}`} onClick={release}>Release</Button>
      <Button size="sm" variant="ghost" aria-label={`Collect for ${name}`} onClick={collect}>Collect</Button>
    </ButtonRow>
  );
  return <ListItemRow name={name} action={actions} />;
};

export { ConsolePlayer };
