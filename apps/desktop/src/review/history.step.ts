/* @layer renderer-app @kind logic */
import { defineReviewStep, nav } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { REVIEW_SESSION } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { waitText } from './wait-text';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer);

const showRunLog = async (tour: AppReviewTour) => {
  await clickNamed(tour, SELECTOR.button, `Show log of run ${REVIEW_SESSION}`, layer(tour) ?? undefined);
  const job = await tour.waitFor(() => tour.find(`${SELECTOR.runJob}[data-state="done"]`), 8000);
  tour.check('run-job-dialog', job !== null, 'a finished run opens in the job dialog, replayed from its generate log', 'the finished run opened no job dialog');
  if (!job) return;
  const logged = await tour.waitFor(() => (job.innerText.match(/\n/g)?.length ?? 0) > 6);
  tour.check('run-job-log', logged === true, 'the job dialog holds the steps and the generator log', 'the run job dialog shows no log');
  await tour.capture('run-log');
  const dialog = job.closest<HTMLElement>(SELECTOR.dialog) ?? document.body;
  await clickNamed(tour, SELECTOR.button, 'Close', dialog);
  const closed = await tour.waitFor(() => tour.find(SELECTOR.runJob) === null);
  tour.check('run-job-closes', closed === true, 'Close dismisses the finished run job', 'the run job dialog stayed open');
};

const checkDetail = async (tour: AppReviewTour) => {
  const picked = await clickNamed(tour, SELECTOR.button, new RegExp(`^${REVIEW_SESSION}\\b`), layer(tour) ?? undefined);
  const shown = picked && await waitText(tour, /changes for this run/i, () => layer(tour));
  tour.check('history-detail', shown, 'picking a run shows its source, changes, players, config and output', 'picking a run showed no detail');
  const parts = await Promise.all([/source/i, /players/i, /config/i, /output/i].map((part) => waitText(tour, part, () => layer(tour))));
  tour.check('history-sections', parts.every(Boolean), 'the detail holds the Source, Players, Config and Output sections', 'the detail misses a section');
  await tour.capture('detail');
};

export default defineReviewStep({
  run: async (tour) => {
    nav.open(ROUTE.history);
    const listed = await waitText(tour, REVIEW_SESSION, () => layer(tour)) && await waitText(tour, 'Stopped', () => layer(tour));
    tour.check('history-listed', listed, `History lists a stopped run of ${REVIEW_SESSION}`, `History does not list a stopped run of ${REVIEW_SESSION}`);
    await tour.capture('list');
    await checkDetail(tour);
    await showRunLog(tour);
  },
});
