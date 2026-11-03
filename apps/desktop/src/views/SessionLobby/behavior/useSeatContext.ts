/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import type { LobbySeatSideValue } from '@archipelia/design';
import type { LobbyScreenModel, SeatContext } from '../SessionLobby.type';
import { freeName } from './free-name';
import { nextSlot } from './next-slot';
import { useFreshSlots } from './useFreshSlots';
import { useSidePick } from './useSidePick';

const useSeatContext = (screen: LobbyScreenModel): { context: SeatContext; add: () => void } => {
  const { busy, draft, duplicatePlayer, installed, keep, players, presets, problems, removePlayer, toggleSelected } = screen;
  const slots = useFreshSlots();
  const pick = useSidePick({ players, seats: draft.players, slots, open: toggleSelected });
  const direct = draft.direct !== undefined;
  const { settle } = slots;
  const remove = useCallback((slot: number) => {
    const player = draft.players.find((entry) => entry.slot === slot);
    if (player?.kind === 'set') settle(player.name);
    removePlayer(slot);
  }, [draft.players, removePlayer, settle]);
  const add = useCallback(() => {
    const name = freeName(draft.players, 'Player');
    const slot = nextSlot(draft.players);
    players.add();
    if (direct) slots.mark(name);
    else toggleSelected(slot);
  }, [direct, draft.players, players, slots, toggleSelected]);
  const context = useMemo<SeatContext>(() => ({
    presets,
    installed,
    problemSlots: new Set(problems.map((problem) => problem.slot)),
    direct,
    fresh: slots.fresh,
    busy,
    actions: {
      edit: toggleSelected,
      remove,
      duplicate: duplicatePlayer,
      keep: (slot: number) => void keep(slot),
      pick: (slot: number, side: LobbySeatSideValue) => void pick(slot, side),
    },
  }), [busy, direct, duplicatePlayer, installed, keep, pick, presets, problems, remove, slots.fresh, toggleSelected]);
  return { context, add };
};

export { useSeatContext };
