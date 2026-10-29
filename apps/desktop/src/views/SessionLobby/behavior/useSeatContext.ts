/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { LobbyScreenModel, SeatContext } from '../SessionLobby.type';

const useSeatContext = (screen: LobbyScreenModel): SeatContext => {
  const { busy, duplicatePlayer, keep, presets, problems, removePlayer, selected, toggleSelected } = screen;
  return useMemo(() => ({
    presets,
    problemSlots: new Set(problems.map((problem) => problem.slot)),
    selectedSlot: selected?.slot,
    busy,
    actions: { edit: toggleSelected, remove: removePlayer, duplicate: duplicatePlayer, keep: (slot: number) => void keep(slot) },
  }), [busy, duplicatePlayer, keep, presets, problems, removePlayer, selected?.slot, toggleSelected]);
};

export { useSeatContext };
