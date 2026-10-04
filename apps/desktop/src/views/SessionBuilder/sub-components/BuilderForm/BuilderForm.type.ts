/* @layer renderer-app @kind types */
import type { SessionTemplate } from '@archipelia/model';

type BuilderFormProps = {
  initial: SessionTemplate;
  onRun: (template: SessionTemplate) => void | Promise<void>;
};

export type { BuilderFormProps };
