/* @layer renderer-app @kind types */
import type { RunAction } from '../../SessionBuilder.type';

type BuilderHeaderProps = {
  name: string;
  saved: boolean;
  busy: boolean;
  action: RunAction;
  onName: (name: string) => void;
  onSave: () => void;
};

export type { BuilderHeaderProps };
