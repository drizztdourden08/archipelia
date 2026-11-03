/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import type { LobbySeatSideValue } from '@archipelia/design';
import type { SessionPlayer } from '@archipelia/model';
import { confirmAction } from '@drizztdourden08/brock-react';
import type { SidePickInput } from '../SessionLobby.type';
import { isFreshSeat } from './is-fresh-seat';
import { SLOT_TEXT } from './slot.constants';

const confirmDirect = () =>
  confirmAction({ title: SLOT_TEXT.keepConfirmTitle, message: SLOT_TEXT.keepConfirmMessage, confirmLabel: SLOT_TEXT.keepConfirmLabel, variant: 'danger' });

const dropsWork = (player: SessionPlayer, fresh: boolean): boolean => player.kind === 'set' && !fresh && player.game.length > 0;

const useSidePick = ({ players, seats, slots, open }: SidePickInput) => {
  const { settle } = slots;
  const pickSet = useCallback((player: SessionPlayer) => {
    if (player.kind === 'direct') players.setDirect(player.slot, false);
    else settle(player.name);
    open(player.slot);
  }, [open, players, settle]);
  const pickDirect = useCallback(async (player: SessionPlayer, fresh: boolean) => {
    if (player.kind === 'direct') return;
    if (dropsWork(player, fresh) && !(await confirmDirect())) return;
    settle(player.name);
    players.setDirect(player.slot, true);
  }, [players, settle]);
  return useCallback(async (slot: number, side: LobbySeatSideValue) => {
    const player = seats.find((entry) => entry.slot === slot);
    if (!player) return;
    if (side === 'set') pickSet(player);
    else await pickDirect(player, isFreshSeat(player, slots.fresh));
  }, [pickDirect, pickSet, seats, slots.fresh]);
};

export { useSidePick };
