/* @layer core @kind types */
import type { RequirementRule } from '@archipelia/model';

type PinnedPython = { version: string; release: string; file: string; sha256: string };

type PythonCeiling = { ap: string; maxExclusive: string };

type FallbackRange = { min: string; maxExclusive?: string; warnBelow?: string };

type EngineDefaults = {
  defaultAp: { version: string; commit: string };
  defaultPython: Record<string, PinnedPython>;
  minAp: string;
  pythonCeilings: PythonCeiling[];
  fallbackRange: FallbackRange;
  requirementRules: RequirementRule[];
  smokeGames: string[];
  feedTtlHours: number;
};

export type { EngineDefaults, FallbackRange, PinnedPython, PythonCeiling };
