/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import { validatePlayers } from '../../SessionLobby';
import { nextSlot } from '../../SessionLobby/behavior/next-slot';
import { usePlayersEditor } from '../../SessionLobby/behavior/usePlayersEditor';
import type { SessionPlayersDeps } from '../SessionBuilder.type';

const useSessionPlayers = ({ draft, setDraft, installed, presets, createPreset, guard }: SessionPlayersDeps) => {
  const actions = usePlayersEditor({ setDraft, installed, presets, createPreset, guard });
  const [open, setOpen] = useState<number | null>(null);
  const [overrides, setOverrides] = useState<number | null>(null);
  const problems = useMemo(() => {
    const bySlot = new Map<number, string>();
    for (const problem of validatePlayers(draft, { installed, presets })) if (!bySlot.has(problem.slot)) bySlot.set(problem.slot, problem.message);
    return bySlot;
  }, [draft, installed, presets]);

  const edit = useCallback((slot: number) => setOpen((current) => (current === slot ? null : slot)), []);
  const editOverrides = useCallback((slot: number) => setOverrides((current) => (current === slot ? null : slot)), []);
  const add = useCallback(() => {
    setOpen(nextSlot(draft.players));
    actions.add();
  }, [actions, draft.players]);
  const remove = useCallback((slot: number) => {
    setOpen((current) => (current === slot ? null : current));
    actions.remove(slot);
  }, [actions]);

  return { actions, add, edit, editOverrides, open, overrides, problems, remove };
};

export { useSessionPlayers };
