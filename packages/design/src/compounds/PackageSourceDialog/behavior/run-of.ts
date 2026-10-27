/* @layer renderer-app @kind logic */
import type { PackageSourceDialogProps, SourceValues } from '../PackageSourceDialog.type';
import { sourceView } from './source-view';
import type { Run } from './step-problems.type';

const runOf = (props: PackageSourceDialogProps, values: SourceValues): Run => ({ props, view: sourceView(props, values) });

export { runOf };
