/* @layer renderer-app @kind config */
import type { SlotState } from '@archipelia/model';
import type { SeatState } from '../stores/session-view-store.type';

const SLOT_SEAT: Record<SlotState, SeatState> = {
  uploading: 'checking',
  checking: 'checking',
  'waiting-consent': 'checking',
  ok: 'ready',
  refused: 'refused',
};

const SEAT_TEXT = {
  yours: 'Your seat',
  held: 'Held for a player who joins',
  unknownClient: 'Unknown client',
  unlisted: 'unlisted client',
} as const;

export { SEAT_TEXT, SLOT_SEAT };
