/* @layer renderer-app @kind config */
import type { FieldDescriptor } from '@drizztdourden08/tessera/data';
import { FIT_LABEL, SOURCE_LABEL, STATE_LABEL, VERIFIED_CHOICE } from '../GameStore.constants';

const choice = (path: string, label: string, labels: Record<string, string>): FieldDescriptor =>
  ({ path, label, kind: 'enum', optional: false, closed: true, options: Object.values(labels) });

const STABILITY_LABEL = { stable: 'stable', unstable: 'unstable', alpha: 'alpha', beta: 'beta', untested: 'untested', unknown: 'unknown' };

const GAME_FIELDS: readonly FieldDescriptor[] = [
  { path: 'name', label: 'Name', kind: 'string', optional: false },
  choice('source', 'Source', SOURCE_LABEL),
  choice('state', 'Installed', STATE_LABEL),
  choice('fit', 'Version fit', FIT_LABEL),
  choice('verified', 'Verified', VERIFIED_CHOICE),
  choice('stability', 'Stability', STABILITY_LABEL),
  { path: 'tags', label: 'Tags', kind: 'array', optional: false, of: { path: 'tags[]', label: 'Tag', kind: 'string', optional: false } },
];

export { GAME_FIELDS };
