/* @layer renderer-app @kind logic */
import type { ServerEntry } from '@archipelia/model';

const listRows = (servers: readonly ServerEntry[], draft: ServerEntry | null): readonly ServerEntry[] =>
  (draft && !draft.id ? [draft, ...servers] : servers);

export { listRows };
