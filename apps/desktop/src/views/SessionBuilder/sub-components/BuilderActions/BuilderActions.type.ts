/* @layer renderer-app @kind types */
import type { BuilderButton, ButtonReasons } from '../../SessionBuilder.type';

type BuilderActionsProps = {
  buttons: BuilderButton[];
  busy: boolean;
  reasons: ButtonReasons;
  on: Record<BuilderButton, () => void>;
};

export type { BuilderActionsProps };
