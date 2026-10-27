/* @layer renderer-app @kind component */
import { WizardDialog } from '@drizztdourden08/tessera/composites';
import { useSourceWizard } from './behavior/useSourceWizard';
import { SOURCE_TEXT } from './PackageSourceDialog.constants';
import type { PackageSourceDialogProps } from './PackageSourceDialog.type';
import { StepView } from './sub-components/StepView';
import './PackageSourceDialog.css';

const PackageSourceDialog = (props: PackageSourceDialogProps) => {
  const { wizard, view } = useSourceWizard(props);
  return (
    <WizardDialog open wizard={wizard} orientation="vertical" className="package-source" title={SOURCE_TEXT.title(props.module)} onExit={props.onClose}>
      <StepView dialog={props} wizard={wizard} view={view} />
    </WizardDialog>
  );
};

export { PackageSourceDialog };
