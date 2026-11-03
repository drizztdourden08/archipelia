/* @layer client-kit @kind logic */
import type { OpenPick, OpenSeats } from './seats.type';

const pickOpenSeat = (open: OpenSeats | undefined): OpenPick => {
  if (!open) return { ok: false, reason: 'none', message: 'This lobby has no open seats.' };
  if (open.free < 1) return { ok: false, reason: 'full', message: 'Every open seat of this lobby is taken.' };
  return { ok: true };
};

export { pickOpenSeat };
