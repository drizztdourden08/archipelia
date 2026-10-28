/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import { runOverridesOf } from '@archipelia/model';
import { useActionGuard } from '../../../hooks/useActionGuard';
import { useLibraryData } from '../../../hooks/useLibraryData';
import { useTabDraft } from '../../../hooks/useTabDraft';
import { useLobbyStore } from '../../../stores/useLobbyStore';
import type { LobbyScreenProps } from '../SessionLobby.type';
import { LOBBY_FAILURE } from '../SessionLobby.constants';
import { useLobbyActions } from './useLobbyActions';
import { usePlayersEditor } from './usePlayersEditor';
import { useProblems } from './useProblems';
import { useRunAction } from './useRunAction';

const useLobbyScreen = ({ tab, saved }: LobbyScreenProps) => {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const { guard, busy, error } = useActionGuard(LOBBY_FAILURE);
  const data = useLibraryData();
  const { installed, presets, createPreset } = data;
  const { draft, setDraft } = useTabDraft(tab, saved);
  const players = usePlayersEditor({ setDraft, installed, presets, createPreset, guard });
  const check = useProblems(draft, { installed, presets }, setSelectedSlot);
  const actions = useLobbyActions({ tab, saved, draft, guard, attemptRun: check.attemptRun });
  const action = useRunAction(tab, draft, () => void actions.run());
  const lobby = useLobbyStore((state) => state.lobbies[tab.serverId]?.find((entry) => entry.id === tab.lobbyId));
  const changes = useMemo(() => runOverridesOf(saved, draft), [draft, saved]);
  const toggleSelected = useCallback((slot: number) => setSelectedSlot((current) => (current === slot ? null : slot)), []);
  const selected = draft.players.find((player) => player.slot === selectedSlot);
  return { ...data, ...check, ...actions, action, busy, changes, draft, error, lobby, players, saved, selected, tab, toggleSelected };
};

export { useLobbyScreen };
