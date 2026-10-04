/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import { useKeyedGuard, useUnsavedChanges } from '@drizztdourden08/brock-react';
import type { GeneratorSettings, HostTarget, ServerSettings, SessionTemplate } from '@archipelia/model';
import type { BuilderParams } from '../SessionBuilder.type';
import { useBuilderData } from './useBuilderData';
import { useHostingDefaults } from './useHostingDefaults';
import { useRoomPassword } from './useRoomPassword';
import { usePlayersEditor } from './usePlayersEditor';
import { validateTemplate } from './template-validation';
import { hostOfKind } from './host-of-kind';
import { withPort } from './with-port';
import { withServer } from './with-server';
import { withoutPassword } from './without-password';
import { UNSAVED_SESSION } from '../SessionBuilder.constants';
import { failWith } from '../../../hooks/fail-with';
import { failureOf } from './failure-of';

const useSessionBuilder = ({ initial, onRun }: BuilderParams) => {
  const [draft, setDraft] = useState<SessionTemplate>(initial);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const { guard: keyed, isBusy, clearError, lastError } = useKeyedGuard();
  const [savedJson, setSavedJson] = useState<string | null>(null);
  const data = useBuilderData();
  const { installed, presets, servers, templates, saveTemplate, createPreset } = data;
  const hosting = useHostingDefaults();
  const room = useRoomPassword();
  const { commit, clear } = room;

  const guard = useCallback((key: string, work: () => Promise<unknown>) => {
    clearError();
    return keyed(key, failWith(failureOf(key), work));
  }, [clearError, keyed]);

  const players = usePlayersEditor({ setDraft, installed, presets, createPreset, guard });
  const problems = useMemo(() => validateTemplate(draft, { installed, presets }), [draft, installed, presets]);

  const setName = useCallback((name: string) => setDraft((current) => ({ ...current, name })), []);
  const setGenerator = useCallback((patch: Partial<GeneratorSettings>) =>
    setDraft((current) => ({ ...current, generator: { ...current.generator, ...patch } })), []);
  const setServer = useCallback((patch: Partial<ServerSettings>) =>
    setDraft((current) => ({ ...current, server: { ...current.server, ...patch } })), []);
  const setHost = useCallback((change: (host: HostTarget) => HostTarget) =>
    setDraft((current) => ({ ...current, host: change(current.host) })), []);
  const setHostKind = useCallback((kind: HostTarget['kind']) => setHost((host) => hostOfKind(kind, host, servers, hosting)), [hosting, servers, setHost]);
  const setPort = useCallback((port: number) => setHost((host) => withPort(host, port)), [setHost]);
  const setRemoteServer = useCallback((serverId: string) => setHost((host) => withServer(host, serverId)), [setHost]);

  const persist = useCallback(async () => {
    const saved = await saveTemplate(await commit(draft));
    setDraft(saved);
    setSavedJson(JSON.stringify(saved));
    return saved;
  }, [commit, draft, saveTemplate]);

  const save = useCallback(() => guard('save', persist), [guard, persist]);
  const run = useCallback(() => guard('run', async () => onRun(await persist())), [guard, onRun, persist]);

  const clearPassword = useCallback(() => guard('password', async () => {
    setDraft(await clear(draft));
    const stored = templates.find((template) => template.id === draft.id);
    if (stored) await saveTemplate(withoutPassword(stored));
  }), [clear, draft, guard, saveTemplate, templates]);

  const toggleSelected = useCallback((slot: number) => setSelectedSlot((current) => (current === slot ? null : slot)), []);
  const selected = draft.players.find((player) => player.slot === selectedSlot);
  const draftJson = JSON.stringify(draft);
  const saved = savedJson !== null && !room.password && savedJson === draftJson;
  const dirty = Boolean(room.password) || draftJson !== (savedJson ?? JSON.stringify(initial));
  useUnsavedChanges(dirty, UNSAVED_SESSION);

  return {
    ...data, busy: isBusy(), clearPassword, draft, error: lastError, password: room.password, players, problems, run, save, saved, selected,
    setGenerator, setHostKind, setName, setPassword: room.setPassword, setPort, setRemoteServer, setServer, toggleSelected,
  };
};

export { useSessionBuilder };
