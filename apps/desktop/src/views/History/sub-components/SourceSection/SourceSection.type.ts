/* @layer renderer-app @kind types */
import type { RunChip, SourceLink } from '../../History.type';

type SourceSectionProps = {
  link: SourceLink;
  chip: RunChip;
  onOpen: (sessionId: string) => void;
};

export type { SourceSectionProps };
