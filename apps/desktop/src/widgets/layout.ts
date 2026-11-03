/* @layer renderer-app @kind config */
import { defineLayoutPreset } from '@drizztdourden08/brock-react';

export default defineLayoutPreset({
  revision: 4,
  onRevision: 'apply',
  rows: [
    ['main', { column: [['players', 'room'], ['hints', 'spoiler']] }],
    { cells: [['server-log', 'generation-log', 'console']], under: 'main' },
  ],
  sizes: [1, 0.3],
  widths: [[0.7, 0.3]],
});
