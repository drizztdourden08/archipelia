/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import type { SessionTemplate } from '@archipelia/model';
import { useActionGuard } from '../../../hooks/useActionGuard';
import { useLibraryData } from '../../../hooks/useLibraryData';
import { useSavedDraft } from '../../../hooks/useSavedDraft';
import { useSessionLobby } from '../../../hooks/useSessionLobby';
import { lobbyServerOf } from '../../../lobbies/lobby-server-of';
import { useLiveStore } from '../../../stores/useLiveStore';
import { useRunsStore } from '../../../stores/useRunsStore';
import { useSessionPickStore } from '../../../stores/useSessionPickStore';
import { BUILDER_FAILURE } from '../SessionBuilder.constants';
import { useBuilderActions } from './useBuilderActions';
import { useHostingDefaults } from './useHostingDefaults';
import { useRoomPassword } from './useRoomPassword';
import { useSessionRuns } from './useSessionRuns';
import { useSetupEdits } from './useSetupEdits';
import { withoutPassword } from './without-password';

const useSessionBuilder = (initial: SessionTemplate) => {
  const data = useLibraryData();
  const { templates, saveTemplate, installed, presets } = data;
  const hosting = useHostingDefaults();
  const room = useRoomPassword();
  const { commit, clear, setPassword } = room;
  const pending = Boolean(room.password);
  const { draft, setDraft, keep, reset, base, saved, dirty } = useSavedDraft(initial, pending);
  const { guard, busy, error } = useActionGuard(BUILDER_FAILURE);
  const tab = useLiveStore((state) => state.tabs.find((entry) => entry.sessionId === draft.id));
  const { lobby } = useSessionLobby(tab?.serverId ?? lobbyServerOf(draft), tab?.lobbyId ?? '');
  const runCount = useRunsStore((state) => state.runs.filter((run) => run.source?.sessionId === draft.id).length);

  const discard = useCallback(() => { reset(); setPassword(''); }, [reset, setPassword]);
  const save = useCallback(() => guard('save', async () => {
    useSessionPickStore.getState().select((await keep(await commit(draft))).id);
  }), [commit, draft, guard, keep]);
  const clearPassword = useCallback(() => guard('password', async () => {
    setDraft(await clear(draft));
    const stored = templates.find((template) => template.id === draft.id);
    if (stored) await saveTemplate(withoutPassword(stored));
  }), [clear, draft, guard, saveTemplate, setDraft, templates]);

  const runs = useSessionRuns({ draft, dirty, commit, keep, discard, guard, tab });
  const stored = templates.some((template) => template.id === draft.id);
  const actions = useBuilderActions({
    draft, base, dirty, pending, stored, tab, library: { installed, presets }, runs, onSave: () => void save(), onDiscard: discard,
  });
  const live = lobby !== undefined && lobby.phase !== 'closed';
  return {
    ...data, ...useSetupEdits(setDraft), actions, busy, clearPassword, dirty, draft, error, guard, hosting, live, password: room.password, runCount, saved, setDraft,
    setPassword, stored, tab,
  };
};

export { useSessionBuilder };
