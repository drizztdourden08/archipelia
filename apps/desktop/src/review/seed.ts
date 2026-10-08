/* @layer renderer-app @kind logic */
import { defineReviewSeed } from '@drizztdourden08/brock-react';
import { useFocusStore } from '../stores/useFocusStore';
import { useLibraryStore } from '../stores/useLibraryStore';
import { useRunsStore } from '../stores/useRunsStore';
import { finishedRun } from './finished-run';
import { readyEngine } from './ready-engine';
import { seedLibrary } from './seed-library';

export default defineReviewSeed({
  run: async (tour) => {
    const engine = await readyEngine(tour);
    tour.check('engine-ready', engine.state === 'ready', `the engine is ready with Archipelago ${engine.apVersion ?? ''}`, `the engine is ${engine.state}: ${engine.error ?? 'set it up first'}`);
    if (engine.state !== 'ready') return;
    const template = await seedLibrary(tour);
    const run = await finishedRun(tour, template);
    tour.check('run-finished', run?.status === 'stopped', `the run ${run?.seed ?? ''} of ${template.name} is stopped with its files`, `the review run is ${run?.status ?? 'missing'}`);
    await Promise.all([useRunsStore.getState().load(), useLibraryStore.getState().loadPresets(), useLibraryStore.getState().loadTemplates()]);
    if (run) useFocusStore.getState().focus(run.id);
  },
});
