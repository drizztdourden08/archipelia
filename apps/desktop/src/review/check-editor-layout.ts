/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { EDITOR_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { nameOf } from './name-of';

const rowNames = (root: ParentNode | null): string[] => [...(root?.querySelectorAll<HTMLElement>('[role="group"][aria-labelledby]') ?? [])].map(nameOf);

const advancedOf = (root: ParentNode | null): HTMLDetailsElement | null =>
  [...(root?.querySelectorAll<HTMLDetailsElement>('details') ?? [])].find((details) => EDITOR_UI.worldSections.every((id) => details.querySelector(`[data-section="${id}"]`))) ?? null;

const checkEditorLayout = async (tour: AppReviewTour) => {
  const root = tour.find(SELECTOR.layer);
  const rows = await tour.waitFor(() => (EDITOR_UI.rows.every((name) => rowNames(root).includes(name)) ? true : null));
  tour.check('editor-rows', rows === true, `the setup page shows ${EDITOR_UI.rows.join(', ')} as one compact row each`, `the setup page misses a row: it has ${rowNames(root).join(', ')}`);
  const advanced = advancedOf(root);
  tour.check('editor-advanced', advanced !== null && !advanced.open, 'the port and the world settings sit in Advanced, closed until asked for', 'the world settings are not in a closed Advanced section');
  const players = root?.querySelector<HTMLElement>(`[aria-label="${EDITOR_UI.players}"]`) ?? null;
  tour.check('editor-players', players !== null, 'the setup page lists the saved players, each with a Direct switch', 'the setup page has no Players list');
};

export { checkEditorLayout };
