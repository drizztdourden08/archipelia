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

const layoutOf = (join: HTMLElement, world: HTMLElement) => {
  const a = join.getBoundingClientRect();
  const w = world.getBoundingClientRect();
  const grid = join.closest<HTMLElement>('.grid');
  const wide = roomForTwo(grid);
  const side = w.left >= a.right && Math.abs(w.top - a.top) < 2;
  return {
    pass: wide ? side : w.top >= a.bottom,
    shape: wide ? 'two columns: How players join on the left, the world settings on the right' : 'one column: How players join, then the world settings',
    width: grid?.clientWidth ?? 0,
  };
};

const checkEditorLayout = async (tour: AppReviewTour) => {
  const root = tour.find(SELECTOR.layer);
  const join = await tour.waitFor(() => sectionOf(root, 'how-players-join'));
  const world = sectionOf(root, 'generation');
  const players = root?.querySelector<HTMLElement>('[aria-label="Players"]') ?? null;
  tour.check('editor-players', players !== null, 'the setup page lists the saved players, each with a Direct switch', 'the setup page has no Players list');
  if (!join || !world) {
    tour.check('editor-layout', false, '', 'the setup page misses How players join or the world settings');
    return;
  }
  const { pass, shape, width } = layoutOf(join, world);
  tour.check('editor-layout', pass, `the setup page lays out in ${shape} at ${width} px wide`, `the setup page is not in ${shape}`);
};

export { checkEditorLayout };
