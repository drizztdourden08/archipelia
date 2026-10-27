/* @layer renderer-app @kind logic */
import type { PackageSourceDialogProps, SourceValues, SourceView } from '../PackageSourceDialog.type';
import { buildOf } from './build-of';

const retryOf = (dialog: PackageSourceDialogProps, values: SourceValues, view: SourceView): (() => void) | undefined => {
  const build = buildOf(view.stage);
  if (view.route === 'wheel') return () => dialog.onUseWheel(values.wheelTyped);
  if (view.route === 'pypi') return dialog.onInstallFromPypi;
  if (values.how === 'myself') return dialog.onCheckAgain;
  return build ? () => dialog.onBuildStart(build) : undefined;
};

export { retryOf };
