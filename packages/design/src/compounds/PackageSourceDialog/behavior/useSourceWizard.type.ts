/* @layer renderer-app @kind types */
import type { WizardApi } from '@drizztdourden08/tessera/composites';
import type { SourceValues, SourceView } from '../PackageSourceDialog.type';

type SourceWizard = { wizard: WizardApi<SourceValues>; view: SourceView };

export type { SourceWizard };
