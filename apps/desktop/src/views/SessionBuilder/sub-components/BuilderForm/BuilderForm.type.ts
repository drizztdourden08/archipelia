/* @layer renderer-app @kind types */
import type { SessionTemplate } from '@archipelia/model';

type BuilderFormProps = { initial: SessionTemplate; onDirty?: (dirty: boolean) => void };

export type { BuilderFormProps };
