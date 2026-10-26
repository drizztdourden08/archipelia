/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import type { SessionTemplate } from '@archipelia/model';
import { useActionGuard } from '../../../hooks/useActionGuard';
import { useLibraryData } from '../../../hooks/useLibraryData';
import { useSavedDraft } from '../../../hooks/useSavedDraft';
import { lobbyServerOf } from '../../../lobbies/lobby-server-of';
import { runOfLobby } from '../../../runs/run-of-lobby';
import { useLobbyStore } from '../../../stores/useLobbyStore';
import { useRunsStore } from '../../../stores/useRunsStore';
import { LOBBY_FAILURE } from '../SessionLobby.constants';
import { useLobbyActions } from './useLobbyActions';
import { usePlayersEditor } from './usePlayersEditor';
import { useProblems } from './useProblems';
import { useRunAction } from './useRunAction';

const useLobbyScreen = (initial: SessionTemplate) => {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const { guard, busy, error } = useActionGuard(LOBBY_FAILURE);
  const data = useLibraryData();
  const { installed, presets, createPreset } = data;
  const { draft, setDraft, keep, saved, dirty } = useSavedDraft(initial);
  const players = usePlayersEditor({ setDraft, installed, presets, createPreset, guard });
  const check = useProblems(draft, { installed, presets }, setSelectedSlot);
  const actions = useLobbyActions({ draft, keep, dirty, guard, attemptRun: check.attemptRun });
  const action = useRunAction(draft, { run: () => void actions.run(), start: () => void actions.start() });
  const lobbyId = draft.lobby?.lobbyId;
  const lobby = useLobbyStore((state) => (lobbyId ? state.lobbies[lobbyServerOf(draft)]?.find((entry) => entry.id === lobbyId) : undefined));
  const run = useRunsStore((state) => runOfLobby(state.runs, lobbyId));
  const toggleSelected = useCallback((slot: number) => setSelectedSlot((current) => (current === slot ? null : slot)), []);
  const selected = draft.players.find((player) => player.slot === selectedSlot);
  return { ...data, ...check, ...actions, action, busy, draft, error, lobby, players, run, saved, selected, toggleSelected };
};

export { useLobbyScreen };
