/* @layer renderer-app @kind types */
import type { StartAction } from '../../SessionBuilder.type';

type BuilderHeaderProps = {
  name: string;
  saved: boolean;
  busy: boolean;
  action: StartAction;
  onName: (name: string) => void;
  onSave: () => void;
};

export type { BuilderHeaderProps };
