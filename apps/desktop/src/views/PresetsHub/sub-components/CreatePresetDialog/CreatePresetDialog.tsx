/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { Box, Button, Callout, Field, Select, Stack, TextInput } from '@drizztdourden08/tessera/primitives';
import { DialogShell } from '@drizztdourden08/tessera/composites';
import type { CreatePresetDialogProps } from './CreatePresetDialog.type';

const CreatePresetDialog = ({ creator }: CreatePresetDialogProps) => {
  const { open, busy, canCreate, error, game, gameOptions, name, startFrom, startOptions, pickGame, setName, pickStart, create, close } = creator;
  const handleName = useCallback((event: ChangeEvent<HTMLInputElement>) => setName(event.target.value), [setName]);
  const actions = (
    <>
      <Button variant="tertiary" onClick={close} disabled={busy}>Cancel</Button>
      <Button variant="primary" onClick={create} disabled={!canCreate}>Create</Button>
    </>
  );
  return (
    <DialogShell open={open} onClose={close} title="New preset" actions={actions}>
      <Stack gap="md">
        <Field label="Game">
          <Select value={game} options={gameOptions} onChange={pickGame} placeholder="Pick an installed game" searchable />
        </Field>
        <Field label="Start from">
          <Select value={startFrom} options={startOptions} onChange={pickStart} disabled={!game} />
        </Field>
        <Field label="Name">
          <TextInput value={name} onChange={handleName} placeholder="Preset name" />
        </Field>
        {error && <Box role="alert"><Callout tone="danger">{error}</Callout></Box>}
      </Stack>
    </DialogShell>
  );
};

export { CreatePresetDialog };
