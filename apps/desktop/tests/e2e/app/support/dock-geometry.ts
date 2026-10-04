/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { Page } from 'playwright-core';

type Frame = { title: string; left: number; top: number; right: number; bottom: number };

const MIN_WIDTH = 240;
const MIN_HEIGHT = 200;

const readFrames = (page: Page) => page.evaluate(() => {
  const dock = document.querySelector('[data-testid="dock-layout"]');
  if (!dock) return null;
  const box = dock.getBoundingClientRect();
  const frames = [...dock.querySelectorAll('.dock-layout__pane .widget')].map((node) => {
    const rect = node.getBoundingClientRect();
    const title = node.querySelector('.widget__title')?.textContent ?? '';
    return { title, left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
  });
  return { dock: { title: 'dock', left: box.left, top: box.top, right: box.right, bottom: box.bottom }, frames };
});

const overlaps = (a: Frame, b: Frame) =>
  Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;

const inside = (frame: Frame, dock: Frame) =>
  frame.left >= dock.left - 1 && frame.top >= dock.top - 1 && frame.right <= dock.right + 1 && frame.bottom <= dock.bottom + 1;

const expectReadableDock = async (page: Page, expected: readonly string[]) => {
  const read = await readFrames(page);
  expect(read, 'the session dock is on screen').not.toBeNull();
  if (!read) return;
  const { dock, frames } = read;
  expect(frames.map((f) => f.title).sort()).toEqual([...expected].sort());
  for (const frame of frames) {
    expect(inside(frame, dock), `${frame.title} stays inside the dock`).toBe(true);
    expect(frame.right - frame.left, `${frame.title} width`).toBeGreaterThanOrEqual(MIN_WIDTH);
    expect(frame.bottom - frame.top, `${frame.title} height`).toBeGreaterThanOrEqual(MIN_HEIGHT);
  }
  const clashes = frames.flatMap((a, i) => frames.slice(i + 1).filter((b) => overlaps(a, b)).map((b) => `${a.title}/${b.title}`));
  expect(clashes, 'docked widgets never overlap').toEqual([]);
};

export { expectReadableDock };
