/* @layer client-kit @kind types */
import type { IndexBuildInput } from './index.type';

type ListedBuilds = { listed: Record<string, unknown>[]; inputs: IndexBuildInput[] };

export type { ListedBuilds };
