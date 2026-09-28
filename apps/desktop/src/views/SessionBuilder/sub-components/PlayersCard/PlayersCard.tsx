/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Button, ButtonRow, Card, EmptyState, SectionHeader, Stack } from '@drizztdourden08/tessera/primitives';
import type { PlayersCardProps } from './PlayersCard.type';
import { PlayerRow, PlayerRowHeader } from '../../../../compounds/PlayerRow';
import { sourceValueOf } from '../../behavior/source-value-of';
import { gameOptionsOf } from '../../behavior/game-options-of';
import { sourceOptionsOf } from '../../behavior/source-options-of';
import { overridesLabel } from '../../behavior/overrides-label';

const PlayersCard = ({ players, installed, presets, selectedSlot, busy, actions, onEdit }: PlayersCardProps) => {
  const { setSource } = actions;
  const pickSource = useCallback((slot: number, value: string) => {
    setSource(slot, value, players.find((player) => player.slot === slot)?.game ?? '');
  }, [players, setSource]);
  const last = players[players.length - 1];
  const duplicateLast = useCallback(() => { if (last) actions.duplicate(last.slot); }, [actions, last]);

  return (
    <Card>
      <Stack gap="sm">
        <SectionHeader title={`Players · ${players.length}`} subtitle="A player picks any installed game, then one of its presets or an imported file." />
        {players.length === 0
          ? <EmptyState message={installed.length ? 'No player yet.' : 'No game installed yet. Add games in Games first.'} />
          : (
            <Stack gap="xs">
              <PlayerRowHeader />
              {players.map((player) => (
                <PlayerRow
                  key={player.slot}
                  slot={player.slot}
                  name={player.name}
                  game={player.game}
                  source={sourceValueOf(player)}
                  gameOptions={gameOptionsOf(installed, player.game)}
                  sourceOptions={sourceOptionsOf(player.game, presets)}
                  overrides={overridesLabel(player)}
                  changed={player.source.kind === 'preset' && Object.keys(player.source.overrides).length > 0}
                  fileName={player.source.kind === 'yaml' ? player.source.fileName : undefined}
                  selected={player.slot === selectedSlot}
                  canEdit={player.source.kind === 'preset'}
                  busy={busy}
                  onName={actions.rename}
                  onGame={actions.setGame}
                  onSource={pickSource}
                  onImport={actions.importYaml}
                  onEdit={onEdit}
                  onDuplicate={actions.duplicate}
                  onRemove={actions.remove}
                />
              ))}
            </Stack>
          )}
        <ButtonRow align="start">
          <Button variant="secondary" onClick={actions.add}>Add player</Button>
          {last && <Button variant="ghost" onClick={duplicateLast}>Duplicate player {last.slot}</Button>}
        </ButtonRow>
      </Stack>
    </Card>
  );
};

export { PlayersCard };
