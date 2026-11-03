/* @layer client-kit @kind types */

type HeldSeat = { name: string; free: boolean };

type OpenSeats = { total: number; free: number };

type SeatPick = { ok: true; seat: string } | { ok: false; reason: 'unknown' | 'taken'; message: string };

type OpenPick = { ok: true } | { ok: false; reason: 'none' | 'full'; message: string };

export type { HeldSeat, OpenPick, OpenSeats, SeatPick };
