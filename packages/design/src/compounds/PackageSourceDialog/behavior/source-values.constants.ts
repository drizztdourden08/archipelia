/* @layer renderer-app @kind config */
import type { SourceValues } from '../PackageSourceDialog.type';

const INITIAL_VALUES: SourceValues = { pick: '', trusted: false, typed: '', route: '', wheelTyped: '', how: '', tooled: false };

const FINISHED = { success: true, id: 'done' } as const;

export { FINISHED, INITIAL_VALUES };
