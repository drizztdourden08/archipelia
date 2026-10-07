/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Button, ButtonRow, Field, Select, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { InlineCreateForm } from '@drizztdourden08/tessera/composites';
import type { CreatePresetFormProps } from './CreatePresetForm.type';
import { NO_GAME } from '../../PresetsHub.constants';

const CreatePresetForm = ({ creator, close, onOpenGames }: CreatePresetFormProps) => {
  const { canCreate, create, error, game, gameOptions, pickGame, setStartFrom, startFrom, startOptions } = creator;
  const handleCreate = useCallback((name: string) => {
    void create(name).then((made) => { if (made) close(); });
  }, [create, close]);
  if (!gameOptions.length) {
    return (
      <Stack gap="sm">
        <Text variant="caption">{NO_GAME}</Text>
        <ButtonRow align="start">
          <Button size="sm" variant="primary" onClick={onOpenGames}>Open Games</Button>
          <Button size="sm" variant="tertiary" onClick={close}>Cancel</Button>
        </ButtonRow>
      </Stack>
    );
  }
  const extraFields = (
    <>
      <Field label="Game">
        <Select value={game} options={gameOptions} onChange={pickGame} placeholder="Pick an installed game" searchable />
      </Field>
      <Field label="Start from">
        <Select value={startFrom} options={startOptions} onChange={setStartFrom} disabled={!game} />
      </Field>
    </>
  );
  return (
    <InlineCreateForm
      label="Name"
      placeholder="Preset name"
      submitLabel="Create"
      onCreate={handleCreate}
      onCancel={close}
      canSubmit={canCreate}
      error={error}
      extraFields={extraFields}
    />
  );
};

export { CreatePresetForm };
