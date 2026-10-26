/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { BUILDER_COLUMN_MIN } from '../views/SessionBuilder/SessionBuilder.constants';
import { SELECTOR } from './review-dom.constants';

const sectionOf = (root: ParentNode | null, id: string) => root?.querySelector<HTMLElement>(`[data-section="${id}"]`) ?? null;

const roomForTwo = (grid: HTMLElement | null) => {
  if (!grid) return false;
  const gap = Number.parseFloat(getComputedStyle(grid).columnGap) || 0;
  return grid.clientWidth >= 2 * BUILDER_COLUMN_MIN + gap;
};

const layoutOf = (join: HTMLElement, players: HTMLElement, world: HTMLElement) => {
  const a = join.getBoundingClientRect();
  const p = players.getBoundingClientRect();
  const w = world.getBoundingClientRect();
  const grid = join.closest<HTMLElement>('.grid');
  const wide = roomForTwo(grid);
  const side = w.left >= a.right && Math.abs(w.top - a.top) < 2;
  return {
    pass: p.top >= a.bottom && (wide ? side : w.top >= p.bottom),
    shape: wide ? 'two columns: How players join and the players on the left, the world settings on the right' : 'one column: How players join, the players, then the world settings',
    width: grid?.clientWidth ?? 0,
  };
};

const checkEditorLayout = async (tour: AppReviewTour) => {
  const root = tour.find(SELECTOR.layer);
  const join = await tour.waitFor(() => sectionOf(root, 'how-players-join'));
  const world = sectionOf(root, 'generation');
  const players = root?.querySelector<HTMLElement>('[aria-label="Players"]') ?? null;
  if (!join || !world || !players) {
    tour.check('editor-layout', false, '', 'the editor misses How players join, the players or the world settings');
    return;
  }
  const { pass, shape, width } = layoutOf(join, players, world);
  tour.check('editor-layout', pass, `the editor lays out in ${shape} at ${width} px wide`, `the editor is not in ${shape}`);
};

export { checkEditorLayout };
