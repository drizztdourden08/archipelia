/* @layer renderer-app @kind component */
import { Callout, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { SOURCE_TEXT } from '../../PackageSourceDialog.constants';
import { CandidateCard } from '../CandidateCard';
import { PasteField } from '../PasteField';
import type { CandidateListProps } from './CandidateList.type';

const timeOf = (at: number) => new Date(at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const CandidateList = ({ module, suggestions, looking, picked, onPick, onPaste, onOpenLink }: CandidateListProps) => {
  const { candidates, limitedUntil, pasteFailed } = suggestions;
  return (
    <Stack gap="md">
      {limitedUntil !== undefined && <Callout tone="info">{SOURCE_TEXT.limited(timeOf(limitedUntil))}</Callout>}
      {candidates.length === 0 && limitedUntil === undefined && <Text>{SOURCE_TEXT.empty(module)}</Text>}
      {candidates.map((candidate) => (
        <CandidateCard key={candidate.id} module={module} candidate={candidate} picked={candidate.id === picked} onPick={onPick} onOpenLink={onOpenLink} />
      ))}
      <PasteField failed={pasteFailed === true} looking={looking} onPaste={onPaste} />
    </Stack>
  );
};

export { CandidateList };
