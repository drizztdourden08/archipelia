/* @layer renderer-app @kind hook */
import { useWizard } from '@drizztdourden08/tessera/composites';
import type { PackageSourceDialogProps, SourceValues } from '../PackageSourceDialog.type';
import { FINISHED, INITIAL_VALUES } from './source-values.constants';
import { sourceSteps } from './source-steps';
import { sourceView } from './source-view';
import { useAdvance } from './useAdvance';
import type { SourceWizard } from './useSourceWizard.type';

const useSourceWizard = (props: PackageSourceDialogProps): SourceWizard => {
  const wizard = useWizard<SourceValues>({
    steps: sourceSteps(props),
    initialValues: INITIAL_VALUES,
    onFinish: () => Promise.resolve(FINISHED),
    onFinished: props.onClose,
  });
  const view = sourceView(props, wizard.values);
  useAdvance(wizard, { props, view });
  return { wizard: { ...wizard, dirty: false }, view };
};

export { useSourceWizard };
