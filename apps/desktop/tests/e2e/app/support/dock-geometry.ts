/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { Page } from 'playwright-core';
import { readDockLayout } from '@drizztdourden08/brock-build/testing';
import type { TestRect } from '@drizztdourden08/brock-build/testing';

type Frame = { id: string; left: number; top: number; right: number; bottom: number };

const MIN_WIDTH = 240;
const MIN_HEIGHT = 200;

const frameOf = (id: string, rect: TestRect): Frame => ({ id, left: rect.x, top: rect.y, right: rect.x + rect.width, bottom: rect.y + rect.height });

const windowFrame = (page: Page) => page.evaluate(() => ({ id: 'window', left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }));

const overlaps = (a: Frame, b: Frame) =>
  Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;

const inside = (frame: Frame, box: Frame) =>
  frame.left >= box.left - 1 && frame.top >= box.top - 1 && frame.right <= box.right + 1 && frame.bottom <= box.bottom + 1;

const expectReadableDock = async (page: Page, expected: readonly string[]) => {
  const reading = await readDockLayout(page);
  const box = await windowFrame(page);
  const frames = reading.docked.flatMap((id) => {
    const rect = reading.rects[id];
    return rect ? [frameOf(id, rect)] : [];
  });
  expect(frames.map((f) => f.id).sort()).toEqual([...expected].sort());
  for (const frame of frames) {
    expect(inside(frame, box), `${frame.id} stays inside the window`).toBe(true);
    expect(frame.right - frame.left, `${frame.id} width`).toBeGreaterThanOrEqual(MIN_WIDTH);
    expect(frame.bottom - frame.top, `${frame.id} height`).toBeGreaterThanOrEqual(MIN_HEIGHT);
  }
  const clashes = frames.flatMap((a, i) => frames.slice(i + 1).filter((b) => overlaps(a, b)).map((b) => `${a.id}/${b.id}`));
  expect(clashes, 'docked widgets never overlap').toEqual([]);
};

export { expectReadableDock };
