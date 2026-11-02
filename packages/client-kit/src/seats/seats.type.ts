/* @layer client-kit @kind types */

type HeldSeat = { name: string; free: boolean };

type SeatPick = { ok: true; seat: string } | { ok: false; reason: 'unknown' | 'taken'; message: string };

export type { HeldSeat, SeatPick };
