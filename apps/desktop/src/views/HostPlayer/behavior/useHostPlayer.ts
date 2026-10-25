/* @layer renderer-app @kind hook */
import { useEffect, useMemo, useState } from 'react';
import { useKeyedGuard } from '@drizztdourden08/brock-react';
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import { failWith } from '../../../hooks/fail-with';
import { lobbyRequest } from '../../../lobbies/lobby-request';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { useLobbyStore } from '../../../stores/useLobbyStore';
import { DEFAULT_PLAYER_NAME, FAILURE, MAX_NAME, NO_PRESET, PROBLEM, TEXT } from '../HostPlayer.constants';
import type { HostPlayerDraft, HostPlayerProps } from '../HostPlayer.type';
import { hostSlot } from './host-slot';

const useHostPlayer = ({ serverId, lobbyId }: HostPlayerProps) => {
  const installed = useLibraryStore((state) => state.installed);
  const presets = useLibraryStore((state) => state.presets);
  const loadInstalled = useLibraryStore((state) => state.loadInstalled);
  const loadPresets = useLibraryStore((state) => state.loadPresets);
  const act = useLobbyStore((state) => state.act);
  const { guard, isBusy, errorOf } = useKeyedGuard();
  const [draft, setDraft] = useState<HostPlayerDraft>({ game: '', presetId: NO_PRESET, name: DEFAULT_PLAYER_NAME });
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    void loadInstalled().catch(() => undefined);
    void loadPresets().catch(() => undefined);
  }, [loadInstalled, loadPresets]);

  const gameName = draft.game === '' ? (installed[0]?.schema.game ?? '') : draft.game;
  const game = installed.find((entry) => entry.schema.game === gameName);
  const ofGame = useMemo(() => presets.filter((preset) => preset.game === gameName), [presets, gameName]);
  const preset = ofGame.find((entry) => entry.id === draft.presetId);

  const gameOptions: SelectOption[] = installed.map((entry) => ({ value: entry.schema.game, label: entry.schema.game }));
  const presetOptions: SelectOption[] = [{ value: NO_PRESET, label: TEXT.defaults }, ...ofGame.map((entry) => ({ value: entry.id, label: entry.name }))];

  const name = draft.name.trim();
  const nameProblem = name.length < 1 || name.length > MAX_NAME ? PROBLEM.name : null;
  const gameProblem = game ? null : PROBLEM.game;

  const add = () => {
    setAttempted(true);
    if (!game || nameProblem) return;
    void guard('add', failWith(FAILURE.add, async () => {
      await act(serverId, lobbyRequest.host(lobbyId, name, [hostSlot(name, game, preset)]));
      setDraft((now) => ({ ...now, name: DEFAULT_PLAYER_NAME }));
      setAttempted(false);
    }));
  };

  return {
    draft: { ...draft, game: gameName }, gameOptions, presetOptions,
    noGames: installed.length === 0,
    nameProblem: attempted ? nameProblem : null,
    gameProblem: attempted ? gameProblem : null,
    setGame: (value: string) => setDraft((now) => ({ ...now, game: value, presetId: NO_PRESET })),
    setPreset: (presetId: string) => setDraft((now) => ({ ...now, presetId })),
    setName: (value: string) => setDraft((now) => ({ ...now, name: value })),
    add,
    busy: isBusy('add'),
    error: errorOf('add'),
  };
};

export { useHostPlayer };
