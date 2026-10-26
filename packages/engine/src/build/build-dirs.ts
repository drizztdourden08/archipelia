/* @layer core @kind logic */
import { join } from 'node:path';
import type { BuildDirs } from './build.type';

const buildDirsOf = (work: string): BuildDirs => ({
  work,
  venv: join(work, 'venv'),
  src: join(work, 'src'),
  out: join(work, 'out'),
  scratch: join(work, 'scratch'),
  tools: join(work, 'tools.txt'),
});

export { buildDirsOf };
