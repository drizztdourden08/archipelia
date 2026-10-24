/* @layer core @kind logic */
import { applyRequirementRules } from '../versions/apply-requirement-rules';
import { ENGINE_DEFAULTS } from '../versions/engine-defaults.constants';
import type { SpecParams } from './create-engine-spec.type';
import { engineId } from './engine-id';
import type { EngineSpec } from './engine-spec.type';

const createEngineSpec = ({ ap, python, rules = ENGINE_DEFAULTS.requirementRules }: SpecParams): EngineSpec => {
  const { skip, extra, rules: applied } = applyRequirementRules(rules, ap.version, python.version);
  return {
    id: engineId(ap.version, python.version, python.target),
    target: python.target,
    ap: { version: ap.version, commit: ap.commit },
    python: { version: python.version, release: python.release, file: python.file, sha256: python.sha256 },
    requirements: { skip, extra, rules: applied },
  };
};

export { createEngineSpec };
