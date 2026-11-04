/* @layer renderer-app @kind logic */
import type { SpoilerGroup } from '@archipelia/design';
import type { SpoilerPath } from '@archipelia/sessions/spoiler';
import { listCount } from './list-count';

const pathsOf = (paths: readonly SpoilerPath[]): SpoilerGroup => ({
  key: 'root',
  label: '',
  counts: listCount(paths.length, 'paths'),
  rows: [],
  children: paths.map(({ title, steps }, index): SpoilerGroup => ({
    key: `path:${index}:${title}`,
    label: title,
    counts: listCount(steps.length, 'steps'),
    rows: steps.map((step, at) => ({ id: `${index}:${at}`, primary: step })),
    children: [],
  })),
});

export { pathsOf };
