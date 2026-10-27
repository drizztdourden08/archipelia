/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '../../../ErrorCallout';
import { SOURCE_TEXT } from '../../PackageSourceDialog.constants';
import type { StepBodyProps } from '../../PackageSourceDialog.type';
import { CandidateList } from '../CandidateList';
import { SourceBusy } from '../SourceBusy';
import { TrustFields } from '../TrustFields';
import { PICK_RESET } from './SourceStep.constants';

const SourceStep = ({ dialog, wizard, view }: StepBodyProps) => {
  const { search, module, onPaste, onRetrySearch, onOpenLink } = dialog;
  const { values, update } = wizard;
  if (search.failed) return <ErrorCallout message={search.failed} onRetry={onRetrySearch} />;
  if (!search.suggestions) return <SourceBusy text={SOURCE_TEXT.searching(module)} />;
  return (
    <Stack gap="lg">
      <CandidateList
        module={module}
        suggestions={search.suggestions}
        looking={search.looking}
        picked={values.pick}
        onPick={(candidate) => update(candidate.id === values.pick ? {} : { pick: candidate.id, ...PICK_RESET })}
        onPaste={onPaste}
        onOpenLink={onOpenLink}
      />
      {view.candidate && (
        <TrustFields
          module={module}
          candidate={view.candidate}
          trusted={values.trusted}
          typed={values.typed}
          onTrusted={(trusted) => update({ trusted })}
          onTyped={(typed) => update({ typed })}
        />
      )}
    </Stack>
  );
};

export { SourceStep };
