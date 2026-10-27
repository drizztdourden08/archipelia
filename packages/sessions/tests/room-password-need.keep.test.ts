/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { roomPasswordNeed, scopedTo } from '../src/live-room';
import type { PasswordView } from '../src/live-room';

const idle: PasswordView = { sessionId: null, phase: 'idle', passwordRequired: false };

describe('roomPasswordNeed', () => {
  test('a room without a password never asks for one', () => {
    expect(roomPasswordNeed({ sessionId: 's1', phase: 'live', passwordRequired: false }, 's1')).toBe('none');
    expect(roomPasswordNeed({ sessionId: 's1', phase: 'connecting', passwordRequired: false }, 's1')).toBe('none');
    expect(roomPasswordNeed({ sessionId: 's1', phase: 'failed', passwordRequired: false }, 's1')).toBe('none');
  });

  test('a password that was given is set, not missing', () => {
    expect(roomPasswordNeed({ sessionId: 's1', phase: 'live', passwordRequired: true }, 's1')).toBe('given');
  });

  test('a required password that was not given is missing', () => {
    expect(roomPasswordNeed({ sessionId: 's1', phase: 'password', passwordRequired: true }, 's1')).toBe('missing');
  });

  test('another session needing a password does not make this one need it', () => {
    expect(roomPasswordNeed({ sessionId: 's2', phase: 'password', passwordRequired: true }, 's1')).toBe('none');
    expect(roomPasswordNeed(idle, 's1')).toBe('none');
    expect(roomPasswordNeed({ sessionId: 's1', phase: 'password', passwordRequired: true }, null)).toBe('none');
  });
});

describe('scopedTo', () => {
  const held: { sessionId: string | null; phase: string } = { sessionId: 's1', phase: 'password' };
  const empty: { sessionId: string | null; phase: string } = { sessionId: null, phase: 'idle' };

  test('keeps the live state of the session it belongs to', () => {
    expect(scopedTo(held, 's1', empty)).toBe(held);
  });

  test('gives the idle state to any other session or none', () => {
    expect(scopedTo(held, 's2', empty)).toBe(empty);
    expect(scopedTo(held, null, empty)).toBe(empty);
  });
});
