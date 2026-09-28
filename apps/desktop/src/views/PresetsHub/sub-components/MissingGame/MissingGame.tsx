/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Button, ButtonRow, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { MissingGameProps } from './MissingGame.type';

const MissingGame = ({ preset, onOpenGames, onDelete }: MissingGameProps) => {
  const handleDelete = useCallback(() => onDelete(preset), [onDelete, preset]);
  return (
    <Stack gap="md">
      <Text variant="subtitle">{preset.name}</Text>
      <Text variant="body">{preset.game} is not installed, so this preset cannot be edited.</Text>
      <Text variant="caption">Add the game from Games and its options come back. The preset keeps {Object.keys(preset.values).length} saved values.</Text>
      <ButtonRow align="start">
        <Button variant="primary" onClick={onOpenGames}>Open Games</Button>
        <Button variant="ghost" onClick={handleDelete}>Delete</Button>
      </ButtonRow>
    </Stack>
  );
};

export { MissingGame };
