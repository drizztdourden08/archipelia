/* @layer tooling-scripts @kind logic */
import DEFAULTS from '@archipelia/engine/engine-defaults.json' with { type: 'json' };
import { applyRules } from './apply-rules.mjs';
import { currentTarget } from './current-target.mjs';
import { engineId } from './engine-id.mjs';

const defaultSpec = (target = currentTarget()) => {
  const python = DEFAULTS.defaultPython[target];
  if (!python) throw new Error(`no default Python for ${target}`);
  const { version, commit } = DEFAULTS.defaultAp;
  return {
    id: engineId(version, python.version, target),
    target,
    ap: { version, commit },
    python,
    requirements: applyRules(DEFAULTS.requirementRules, version, python.version),
  };
};

export { defaultSpec };
