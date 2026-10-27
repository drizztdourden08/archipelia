/* @layer renderer-app @kind types */
import type { Session } from '@archipelia/model';

type OutputSectionProps = {
  run: Session;
  onShowLog: (run: Session) => void;
};

export type { OutputSectionProps };
