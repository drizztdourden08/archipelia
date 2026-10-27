/* @layer renderer-app @kind types */
import type { SourceCandidate } from '@archipelia/model';

type TrustFieldsProps = {
  module: string;
  candidate: SourceCandidate;
  trusted: boolean;
  typed: string;
  onTrusted: (trusted: boolean) => void;
  onTyped: (typed: string) => void;
};

export type { TrustFieldsProps };
