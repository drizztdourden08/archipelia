/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Button, ButtonRow, Select, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { PlayerSourceCellProps } from './PlayerSourceCell.type';
import { sourceValueOf } from '../../behavior/source-value-of';
import { sourceOptionsOf } from '../../behavior/source-options-of';
import { playerLabel } from '../../behavior/player-label';

const PlayerSourceCell = ({ player, presets, busy, onSource, onImport }: PlayerSourceCellProps) => {
  const { slot, game, source } = player;
  const pick = useCallback((value: string) => onSource(slot, value, game), [game, onSource, slot]);
  const importFile = useCallback(() => onImport(slot), [onImport, slot]);
  const fileName = source.kind === 'yaml' ? source.fileName : '';
  const verb = fileName ? 'Replace file' : 'Import file';
  return (
    <Stack gap="xs">
      <Select value={sourceValueOf(player)} options={sourceOptionsOf(game, presets)} placeholder="Pick a preset" onChange={pick} />
      {source.kind === 'yaml' && (
        <ButtonRow gap="xs" align="start">
          <Button size="sm" variant="secondary" disabled={busy} aria-label={`${verb} for ${playerLabel(player)}`} onClick={importFile}>{verb}</Button>
          {fileName && <Text variant="caption" className="session-builder__file">{fileName}</Text>}
        </ButtonRow>
      )}
    </Stack>
  );
};

export { PlayerSourceCell };
