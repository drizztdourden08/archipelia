/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import { runOverridesOf } from '@archipelia/model';
import { useActionGuard } from '../../../hooks/useActionGuard';
import { useLibraryData } from '../../../hooks/useLibraryData';
import { useTabDraft } from '../../../hooks/useTabDraft';
import { useLobbyStore } from '../../../stores/useLobbyStore';
import type { LobbyScreenProps, SeatEditing } from '../SessionLobby.type';
import { LOBBY_FAILURE } from '../SessionLobby.constants';
import { toggleSeat } from './toggle-seat';
import { useLobbyActions } from './useLobbyActions';
import { usePlayersEditor } from './usePlayersEditor';
import { useProblems } from './useProblems';
import { useRunAction } from './useRunAction';

const useLobbyScreen = ({ tab, saved }: LobbyScreenProps) => {
  const [editing, setEditing] = useState<SeatEditing | null>(null);
  const { guard, busy, error } = useActionGuard(LOBBY_FAILURE);
  const data = useLibraryData();
  const { installed, presets, createPreset, saveTemplate } = data;
  const { draft, setDraft } = useTabDraft(tab, saved);
  const players = usePlayersEditor({ setDraft, installed, presets, createPreset, guard });
  const showSeat = useCallback((slot: number, option?: string) => setEditing({ slot, option }), []);
  const check = useProblems(draft, { installed, presets }, showSeat);
  const lobby = useLobbyStore((state) => state.lobbies[tab.serverId]?.find((entry) => entry.id === tab.lobbyId));
  const actions = useLobbyActions({ tab, saved, draft, saveTemplate, guard, attemptRun: check.attemptRun, lobby });
  const action = useRunAction(tab, draft, () => void actions.run());
  const changes = useMemo(() => runOverridesOf(saved, draft), [draft, saved]);
  const toggleSelected = useCallback((slot: number) => setEditing((current) => toggleSeat(current, slot)), []);
  const clearFocus = useCallback(() => setEditing((current) => (current ? { slot: current.slot } : current)), []);
  const closeEditor = useCallback(() => setEditing(null), []);
  const { duplicate, remove } = players;
  const removePlayer = useCallback((slot: number) => {
    remove(slot);
    setEditing(null);
  }, [remove]);
  const duplicatePlayer = useCallback((slot: number) => {
    duplicate(slot);
    setEditing(null);
  }, [duplicate]);
  const selected = draft.players.find((player) => player.slot === editing?.slot);
  const focusKey = selected ? (editing?.option ?? null) : null;
  return {
    ...data, ...check, ...actions, action, busy, changes, clearFocus, closeEditor, draft, duplicatePlayer, error, focusKey, lobby, players, removePlayer, saved, selected, tab,
    toggleSelected,
  };
};

export { useLobbyScreen };
