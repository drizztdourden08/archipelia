/* @layer renderer-app @kind types */
import type { SourceCandidate } from '@archipelia/model';

type CandidateCardProps = {
  module: string;
  candidate: SourceCandidate;
  picked: boolean;
  onPick: (candidate: SourceCandidate) => void;
  onOpenLink: (url: string) => void;
};

export type { CandidateCardProps };
