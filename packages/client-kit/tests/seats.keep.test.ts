/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { freeSeats, pickOpenSeat, pickSeat, withSeat } from '../src';

const seats = [{ name: 'Alice', free: true }, { name: 'Bob', free: false }];

describe('K1 held seats for a joining client', { tags: ['critical'] }, () => {
  test('lists only the free seats and nothing when the lobby holds none', () => {
    expect(freeSeats(seats)).toEqual(['Alice']);
    expect(freeSeats(undefined)).toEqual([]);
  });

  test('picks a free seat in the spelling of the lobby, whatever the case of the input', () => {
    expect(pickSeat(seats, ' alice ')).toEqual({ ok: true, seat: 'Alice' });
  });

  test('says why a seat cannot be picked: it is taken, or the lobby holds none of that name', () => {
    expect(pickSeat(seats, 'BOB')).toEqual({ ok: false, reason: 'taken', message: 'The seat Bob is already taken.' });
    expect(pickSeat(seats, 'Ghost')).toEqual({ ok: false, reason: 'unknown', message: 'This lobby holds no seat named Ghost.' });
    expect(pickSeat(undefined, 'Alice')).toMatchObject({ ok: false, reason: 'unknown' });
  });

  test('picks an open seat while one is free, and says why when none is', () => {
    expect(pickOpenSeat({ total: 2, free: 1 })).toEqual({ ok: true });
    expect(pickOpenSeat({ total: 2, free: 0 })).toMatchObject({ ok: false, reason: 'full' });
    expect(pickOpenSeat(undefined)).toMatchObject({ ok: false, reason: 'none' });
  });

  test('adds the seat to a hello only when one was picked', () => {
    const hello = { type: 'hello' };
    expect(withSeat(hello, 'Alice')).toEqual({ type: 'hello', seat: 'Alice' });
    expect(withSeat(hello, undefined)).toBe(hello);
  });
});
