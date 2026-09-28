/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
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

const useSessionBuilder = ({ initial, onRun }: BuilderParams) => {
  const [draft, setDraft] = useState<SessionTemplate>(initial);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedJson, setSavedJson] = useState<string | null>(null);
  const data = useBuilderData(setError);
  const { installed, presets, servers, templates, saveTemplate, createPreset } = data;
  const hosting = useHostingDefaults();
  const room = useRoomPassword();
  const { commit, clear } = room;

  const guard = useCallback(async (work: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await work();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }, []);

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

  const save = useCallback(() => guard(persist), [guard, persist]);
  const run = useCallback(() => guard(async () => onRun(await persist())), [guard, onRun, persist]);

  const clearPassword = useCallback(() => guard(async () => {
    setDraft(await clear(draft));
    const stored = templates.find((template) => template.id === draft.id);
    if (stored) await saveTemplate(withoutPassword(stored));
  }), [clear, draft, guard, saveTemplate, templates]);

  const toggleSelected = useCallback((slot: number) => setSelectedSlot((current) => (current === slot ? null : slot)), []);
  const selected = draft.players.find((player) => player.slot === selectedSlot);
  const saved = savedJson !== null && !room.password && savedJson === JSON.stringify(draft);

  return {
    ...data, busy, clearPassword, draft, error, password: room.password, players, problems, run, save, saved, selected,
    setGenerator, setHostKind, setName, setPassword: room.setPassword, setPort, setRemoteServer, setServer, toggleSelected,
  };
};

export { useSessionBuilder };
