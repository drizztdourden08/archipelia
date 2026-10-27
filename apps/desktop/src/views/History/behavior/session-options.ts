/* @layer renderer-app @kind logic */
import type { Session, SessionTemplate } from '@archipelia/model';
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import { ALL } from '../../../stores/history-filter-store.constants';
import { sourceKeyOf } from './source-key';
import { sourceNameOf } from './source-name';

const sessionOptions = (runs: readonly Session[], templates: readonly SessionTemplate[]): SelectOption[] => {
  const named = new Map<string, string>(templates.map((template) => [template.id, template.name]));
  for (const run of runs) if (!named.has(sourceKeyOf(run))) named.set(sourceKeyOf(run), sourceNameOf(run));
  const sorted = [...named].sort(([, a], [, b]) => a.localeCompare(b)).map(([value, label]) => ({ value, label }));
  return [{ value: ALL, label: 'All sessions' }, ...sorted];
};

export { sessionOptions };
