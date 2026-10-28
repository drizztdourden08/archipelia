/* @layer renderer-app @kind config */
import { defineLayoutPreset } from '@drizztdourden08/brock-react';

export default defineLayoutPreset({
  revision: 3,
  onRevision: 'apply',
  rows: [
    [{ column: ['network', 'room'], sizes: [0.6, 0.4] }, 'main', { column: ['players', 'hints'], sizes: [0.6, 0.4] }],
    { cells: ['log', 'console', 'spoiler'], under: 'main' },
  ],
  sizes: [1, 0.3],
  widths: [[0.22, 0.56, 0.22]],
});
