/* @layer renderer-app @kind types */
import type { SourceCandidate, SourceSuggestions } from '@archipelia/model';

type CandidateListProps = {
  module: string;
  suggestions: SourceSuggestions;
  looking: boolean;
  picked: string;
  onPick: (candidate: SourceCandidate) => void;
  onPaste: (text: string) => void;
  onOpenLink: (url: string) => void;
};

export type { CandidateListProps };
