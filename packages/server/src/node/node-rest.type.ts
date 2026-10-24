/* @layer core @kind types */
import type { EmitJob } from '@drizztdourden08/brock-core/jobs';
import type { CoreEnvironment, CoreEvent } from '../core/core-ports.type';

type NodeRestOptions = {
  onEvent?: (event: CoreEvent) => void;
  onJob?: EmitJob;
  automation?: boolean;
  lanHost?: () => string;
  env?: Readonly<Record<string, string | undefined>>;
  environment?: CoreEnvironment;
};

export type { NodeRestOptions };
