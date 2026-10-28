/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { SessionTemplate } from '@archipelia/model';
import { useActionGuard } from '../../../hooks/useActionGuard';
import { useLibraryData } from '../../../hooks/useLibraryData';
import { useSavedDraft } from '../../../hooks/useSavedDraft';
import { useSessionLobby } from '../../../hooks/useSessionLobby';
import { useSessionStart } from '../../../hooks/useSessionStart';
import { lobbyServerOf } from '../../../lobbies/lobby-server-of';
import { showTab } from '../../../live/show-tab';
import { useLiveStore } from '../../../stores/useLiveStore';
import { BUILDER_FAILURE, SETUP_TEXT } from '../SessionBuilder.constants';
import type { StartAction } from '../SessionBuilder.type';
import { setupProblems } from './setup-problems';
import { useHostingDefaults } from './useHostingDefaults';
import { useRoomPassword } from './useRoomPassword';
import { useSetupEdits } from './useSetupEdits';
import { withoutPassword } from './without-password';

const useSessionBuilder = (initial: SessionTemplate) => {
  const data = useLibraryData();
  const { templates, saveTemplate } = data;
  const hosting = useHostingDefaults();
  const room = useRoomPassword();
  const { commit, clear } = room;
  const { draft, setDraft, keep, saved, dirty } = useSavedDraft(initial, Boolean(room.password));
  const { guard, busy, error } = useActionGuard(BUILDER_FAILURE);
  const startSession = useSessionStart();
  const [started, setStarted] = useState<string | null>(null);
  const tab = useLiveStore((state) => state.tabs.find((entry) => entry.sessionId === draft.id));
  const { lobby } = useSessionLobby(tab?.serverId ?? lobbyServerOf(draft), tab?.lobbyId ?? '');

  const save = useCallback(() => guard('save', async () => keep(await commit(draft))), [commit, draft, guard, keep]);
  const start = useCallback(() => guard('start', async () => {
    const launched = await startSession({ template: await commit(draft), keep });
    if (launched) setStarted(launched.tabId);
  }), [commit, draft, guard, keep, startSession]);
  useEffect(() => { if (started && !dirty) showTab(started); }, [dirty, started]);

  const clearPassword = useCallback(() => guard('password', async () => {
    setDraft(await clear(draft));
    const stored = templates.find((template) => template.id === draft.id);
    if (stored) await saveTemplate(withoutPassword(stored));
  }), [clear, draft, guard, saveTemplate, setDraft, templates]);

  const problems = setupProblems(draft);
  const action: StartAction = { label: SETUP_TEXT.start, reason: problems[0], onClick: () => void start() };
  const live = lobby !== undefined && lobby.phase !== 'closed';
  return {
    ...data, ...useSetupEdits(setDraft), action, busy, clearPassword, draft, error, hosting, live, password: room.password, save, saved, setDraft, setPassword: room.setPassword,
  };
};

export { useSessionBuilder };
