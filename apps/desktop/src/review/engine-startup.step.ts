/* @layer renderer-app @kind logic */
import { defineReviewStep } from '@drizztdourden08/brock-react';
import { appApi } from '../ipc/app-api';
import { DECISION_KINDS } from './engine-startup.step.constants';
import { rehearseFirstRun } from './rehearse-first-run';
import { rehearseOffer } from './rehearse-offer';
import { dialogWith } from './dialog-with';

export default defineReviewStep({
  run: async (tour) => {
    tour.check('startup-silent', dialogWith(tour, /set up the engine|is out/i)() === null, 'the review launch showed no start-up prompt', 'a dialog is open on a review launch');
    const decision = await appApi().engineStartup().catch(() => null);
    const answered = decision !== null && DECISION_KINDS.includes(decision.kind);
    tour.check('startup-decision', answered, `main answers the start-up question (${decision?.kind ?? 'nothing'})`, 'engineStartup did not answer');
    const overview = await appApi().engineOverview().catch(() => null);
    tour.check('startup-overview', overview !== null, 'the engine versions were read for the dialogs', 'the engine versions could not be read, so the dialogs were not rehearsed');
    if (!overview) return;
    await rehearseFirstRun(tour, overview);
    await rehearseOffer(tour, overview);
  },
});
