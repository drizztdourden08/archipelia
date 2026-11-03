/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import type { OptionValue } from '@archipelia/model';
import { FilterBar } from '@drizztdourden08/tessera/composites';
import { Button, ButtonRow, Card, SectionHeader, Stack, Text, Toggle } from '@drizztdourden08/tessera/primitives';
import type { OverridesPanelProps } from './OverridesPanel.type';
import { overridesOf } from '../../behavior/overrides-of';
import { useOverrideRows } from '../../behavior/useOverrideRows';
import { APP_FILE_TEXT } from '../../SessionLobby.constants';
import { OverridesBody } from '../OverridesBody';

const OverridesPanel = ({ player, game, preset, onValue, onReset, onResetAll, onClose }: OverridesPanelProps) => {
  const { slot } = player;
  const overrides = overridesOf(player);
  const { query, setQuery, changedOnly, setChangedOnly, readOnly, rows } = useOverrideRows(game, preset, overrides);
  const handleValue = useCallback((key: string, value: OptionValue, presetValue: OptionValue) => onValue(slot, key, value, presetValue), [onValue, slot]);
  const handleReset = useCallback((key: string) => onReset(slot, key), [onReset, slot]);
  const resetAll = useCallback(() => onResetAll(slot), [onResetAll, slot]);
  const close = useCallback(() => onClose(slot), [onClose, slot]);

  const actions = (
    <ButtonRow gap="xs">
      <Button size="sm" variant="ghost" disabled={!Object.keys(overrides).length} onClick={resetAll}>Reset to preset</Button>
      <Button size="sm" variant="ghost" onClick={close}>Close</Button>
    </ButtonRow>
  );

  return (
    <Card>
      <Stack gap="sm">
        <SectionHeader
          title={`Overrides · player ${slot}`}
          subtitle={`${player.name || 'unnamed'} · ${player.game || 'no game'} · ${preset?.name ?? 'no preset'}`}
          action={actions}
        />
        <FilterBar
          search={query}
          onSearchChange={setQuery}
          searchPlaceholder="Filter options"
          searchLabel="Filter options"
          extra={<Toggle label="Changed only" checked={changedOnly} onChange={setChangedOnly} />}
        />
        {readOnly && <Text variant="caption" tone="muted">{APP_FILE_TEXT.readOnly}</Text>}
        <OverridesBody game={game} preset={preset} readOnly={readOnly} rows={rows} onValue={handleValue} onReset={handleReset} />
      </Stack>
    </Card>
  );
};

export { OverridesPanel };
