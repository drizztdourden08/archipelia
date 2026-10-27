/* @layer renderer-app @kind hook */
import { useWizard } from '@drizztdourden08/tessera/composites';
import type { WizardApi } from '@drizztdourden08/tessera/composites';
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
  const shown: WizardApi<SourceValues> = {
    ...wizard,
    dirty: false,
    busy: wizard.busy || view.running,
    canGoTo: (id) => !view.running && wizard.canGoTo(id),
  };
  return { wizard: shown, view };
};

export { useSourceWizard };
