/* @layer renderer-app @kind logic */
import { defineReviewStep, nav } from '@drizztdourden08/brock-react';
import { STORAGE_FOLDERS } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { waitText } from './wait-text';

export default defineReviewStep({
  run: async (tour) => {
    nav.open('data/storage');
    const layer = () => tour.find(SELECTOR.layer);
    for (const folder of STORAGE_FOLDERS) {
      const sized = await waitText(tour, new RegExp(`${folder}\\s+[\\d.]+ [KMG]?B · [1-9]\\d* items?`), layer, 8000);
      tour.check(`storage-${folder.toLowerCase().replace(/\s+/g, '-')}`, sized, `the Storage page sizes ${folder} with what the seed wrote`, `the Storage page shows no size for ${folder}`);
    }
    const transfer = await waitText(tour, 'Export to zip', layer);
    tour.check('storage-transfer', transfer, 'the Storage page offers the zip and folder export and import', 'the Storage page has no export');
    await tour.capture('storage');
    nav.open('data/old-runs');
    const kept = await waitText(tour, /[1-9]\d* runs kept/, layer);
    tour.check('old-runs', kept, 'the Old runs page counts the kept runs', 'the Old runs page counts no run');
    await tour.capture('old-runs');
  },
});
