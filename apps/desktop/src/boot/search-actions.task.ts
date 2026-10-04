/* @layer renderer-app @kind logic */
import { defineBootTask } from '@drizztdourden08/brock-react';
import { watchSearchActions } from '../search-actions/watch-search-actions';

export default defineBootTask({
  label: 'Adding the search actions',
  after: ['runs'],
  run: ({ report }) => {
    watchSearchActions();
    report(1);
  },
});
