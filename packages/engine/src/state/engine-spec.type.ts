/* @layer core @kind types */
import type { RequirementRule } from '@archipelia/model';

type EngineSpec = {
  id: string;
  target: string;
  ap: { version: string; commit: string };
  python: { version: string; release: string; file: string; sha256: string };
  requirements: { skip: string[]; extra: string[]; rules: RequirementRule[] };
};

export type { EngineSpec };
