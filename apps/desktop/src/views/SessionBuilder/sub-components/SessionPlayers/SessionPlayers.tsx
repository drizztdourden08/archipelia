/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { Box, Button, Flex, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { playerSummary } from '../../behavior/player-summary';
import { useSessionPlayers } from '../../behavior/useSessionPlayers';
import { PLAYER_TEXT } from '../../SessionBuilder.constants';
import { PlayerEditor } from '../PlayerEditor';
import { PlayerRow } from '../PlayerRow';
import type { PlayerRowActions } from '../PlayerRow/PlayerRow.type';
import type { SessionPlayersProps } from './SessionPlayers.type';
import './SessionPlayers.css';

const emptyText = (hasGames: boolean, direct: boolean): string => {
  if (!hasGames && !direct) return PLAYER_TEXT.noInstalled;
  return direct ? PLAYER_TEXT.noneDirect : PLAYER_TEXT.none;
};

const SessionPlayers = ({ builder }: SessionPlayersProps) => {
  const { draft, installed, presets, busy } = builder;
  const players = useSessionPlayers(builder);
  const { actions } = players;
  const on = useMemo((): PlayerRowActions => ({ edit: players.edit, direct: actions.setDirect, duplicate: actions.duplicate, remove: players.remove }), [actions, players.edit, players.remove]);
  return (
    <Stack gap="xs" className="session-players">
      <Flex gap="sm" align="center">
        <Text variant="overline" tone="muted">{`${PLAYER_TEXT.heading} · ${draft.players.length}`}</Text>
        <Button size="sm" variant="secondary" icon={<Icon name="plus" />} className="session-players__add" onClick={players.add}>{PLAYER_TEXT.add}</Button>
      </Flex>
      {draft.players.length === 0 ? (
        <Text variant="body" tone="muted" className="session-players__empty">{emptyText(installed.length > 0, draft.direct !== undefined)}</Text>
      ) : (
        <Box className="session-players__list">
          <Box aria-hidden className="session-players__columns">
            <Text variant="caption" tone="muted" className="session-players__direct">{PLAYER_TEXT.direct}</Text>
          </Box>
          <Box as="ul" aria-label={PLAYER_TEXT.heading} className="session-players__rows">
            {draft.players.map((player, index) => (
              <PlayerRow
                key={player.slot}
                player={player}
                index={index}
                summary={playerSummary(player, presets)}
                problem={players.problems.get(player.slot)}
                open={players.open === player.slot}
                busy={busy}
                on={on}
              >
                <PlayerEditor
                  player={player}
                  installed={installed}
                  presets={presets}
                  busy={busy}
                  overrides={players.overrides === player.slot}
                  actions={actions}
                  onOverrides={players.editOverrides}
                />
              </PlayerRow>
            ))}
          </Box>
        </Box>
      )}
    </Stack>
  );
};

export { SessionPlayers };
