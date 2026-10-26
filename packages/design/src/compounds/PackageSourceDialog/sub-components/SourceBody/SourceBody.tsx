/* @layer renderer-app @kind component */
import { ErrorCallout } from '../../../ErrorCallout';
import { SOURCE_TEXT } from '../../PackageSourceDialog.constants';
import type { PackageSourceDialogProps } from '../../PackageSourceDialog.type';
import { CandidateList } from '../CandidateList';
import { PlanStep } from '../PlanStep';
import { SourceBusy } from '../SourceBusy';
import { TrustStep } from '../TrustStep';

const SourceBody = ({ module, step, ...handlers }: PackageSourceDialogProps) => {
  switch (step.kind) {
    case 'searching':
      return <SourceBusy text={SOURCE_TEXT.searching(module)} />;
    case 'results':
      return <CandidateList module={module} suggestions={step.suggestions} looking={step.looking} onPick={handlers.onPick} onPaste={handlers.onPaste} onOpenLink={handlers.onOpenLink} />;
    case 'trust':
      return <TrustStep module={module} candidate={step.candidate} onTrust={handlers.onTrust} />;
    case 'planning':
      return <SourceBusy text={SOURCE_TEXT.checking(step.candidate.id)} />;
    case 'plan':
      return (
        <PlanStep module={module} plan={step.plan} checking={step.checking} stillMissing={step.stillMissing} installing={step.installing}
          onInstallFromPypi={handlers.onInstallFromPypi} onUseWheel={handlers.onUseWheel} onCheckAgain={handlers.onCheckAgain} />
      );
    case 'failed':
      return <ErrorCallout message={step.message} onRetry={handlers.onRetry} />;
  }
};

export { SourceBody };
