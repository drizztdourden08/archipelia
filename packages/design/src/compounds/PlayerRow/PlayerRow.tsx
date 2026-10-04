/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { Box, Button, ButtonRow, Select, Stack, Status, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import { optionLabel } from './behavior/option-label';
import type { PlayerRowProps } from './PlayerRow.type';
import './PlayerRow.css';

const PlayerRow = (props: PlayerRowProps) => {
  const {
    slot, name, game, source, gameOptions, sourceOptions, overrides, changed, fileName, selected, canEdit, busy,
    onName, onGame, onSource, onImport, onEdit, onDuplicate, onRemove,
  } = props;
  const rename = useCallback((event: ChangeEvent<HTMLInputElement>) => onName(slot, event.target.value), [onName, slot]);
  const pickGame = useCallback((value: string) => onGame(slot, value), [onGame, slot]);
  const pickSource = useCallback((value: string) => onSource(slot, value), [onSource, slot]);
  const importFile = useCallback(() => onImport(slot), [onImport, slot]);
  const edit = useCallback(() => onEdit(slot), [onEdit, slot]);
  const duplicate = useCallback(() => onDuplicate(slot), [onDuplicate, slot]);
  const remove = useCallback(() => onRemove(slot), [onRemove, slot]);
  const player = `player ${slot}`;
  return (
    <Box className={`player-row${selected ? ' player-row--selected' : ''}`} role="group" aria-label={`Player ${slot}`}>
      <Text variant="label" className="player-row__slot" aria-hidden>{slot}</Text>
      <Stack gap="xs">
        <Text variant="caption" className="player-row__caption" aria-hidden>Name</Text>
        <TextInput value={name} placeholder="Name" aria-label={`Name of ${player}`} maxLength={16} onChange={rename} />
      </Stack>
      <Stack gap="xs">
        <Text variant="caption" className="player-row__caption" aria-hidden>Game</Text>
        <Select value={game} options={gameOptions} placeholder="Pick a game" searchable onChange={pickGame}
          aria-label={`Game of ${player}: ${optionLabel(gameOptions, game, 'none')}`} />
      </Stack>
      <Stack gap="xs">
        <Text variant="caption" className="player-row__caption" aria-hidden>Preset</Text>
        <Select
          value={source}
          options={sourceOptions}
          placeholder="Pick a preset"
          aria-label={`Preset of ${player}: ${optionLabel(sourceOptions, source, 'none')}`}
          onChange={pickSource}
        />
        {source === 'yaml' && (
          <ButtonRow gap="xs" align="start">
            <Button size="sm" variant="secondary" disabled={busy} onClick={importFile}>{fileName ? 'Replace file' : 'Import file'}</Button>
            {fileName && <Text variant="caption" className="player-row__file">{fileName}</Text>}
          </ButtonRow>
        )}
      </Stack>
      <Stack gap="xs">
        <Text variant="caption" className="player-row__caption" aria-hidden>Overrides</Text>
        <Box>
          <Status tone={changed ? 'warning' : 'neutral'}>{overrides}</Status>
        </Box>
      </Stack>
      <ButtonRow gap="xs" align="end">
        <Button size="sm" variant={selected ? 'secondary' : 'ghost'} disabled={!canEdit} aria-label={`Edit ${player}`} onClick={edit}>Edit</Button>
        <Button size="sm" variant="ghost" aria-label={`Duplicate ${player}`} onClick={duplicate}>Duplicate</Button>
        <Button size="sm" variant="danger" aria-label={`Remove ${player}`} onClick={remove}>Remove</Button>
      </ButtonRow>
    </Box>
  );
};

export { PlayerRow };
