/* @layer renderer-app @kind component */
import { useCallback, useMemo, useState } from 'react';
import type { OptionValue } from '@archipelia/model';
import { FilterBar } from '@drizztdourden08/tessera/composites';
import { Button, ButtonRow, Card, EmptyState, ScrollArea, SectionHeader, Stack, Toggle } from '@drizztdourden08/tessera/primitives';
import type { OverridesPanelProps } from './OverridesPanel.type';
import { overridesOf } from '../../behavior/overrides-of';
import { overrideRows } from '../../behavior/override-rows';
import { OverrideRow } from '../OverrideRow';

const OverridesPanel = ({ player, game, preset, onValue, onReset, onResetAll, onClose }: OverridesPanelProps) => {
  const [query, setQuery] = useState('');
  const [changedOnly, setChangedOnly] = useState(false);
  const { slot } = player;
  const overrides = overridesOf(player);
  const rows = useMemo(
    () => (game ? overrideRows(game.schema, preset, overrides, { query, changedOnly }) : []),
    [changedOnly, game, overrides, preset, query],
  );
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
        {!game || !preset
          ? <EmptyState message="Pick an installed game and a preset to change its options." />
          : (
            <ScrollArea scrollbar="slim" className="session-builder__override-rows">
              <Stack gap="xs">
                {rows.length === 0 && <EmptyState message="No option matches" />}
                {rows.map((row) => (
                  <OverrideRow
                    key={row.def.key}
                    def={row.def}
                    value={row.value}
                    presetValue={row.presetValue}
                    overridden={row.overridden}
                    problem={row.problem}
                    onValue={handleValue}
                    onReset={handleReset}
                  />
                ))}
              </Stack>
            </ScrollArea>
          )}
      </Stack>
    </Card>
  );
};

export { OverridesPanel };
