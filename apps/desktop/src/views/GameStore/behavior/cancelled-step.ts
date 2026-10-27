/* @layer renderer-app @kind logic */
import type { PackageSourceStep } from '@archipelia/design';

const cancelledStep = (step: PackageSourceStep): PackageSourceStep => {
  if (step.kind !== 'build') return step;
  const { stage, candidate, plan } = step;
  const build = 'build' in stage ? stage.build : undefined;
  if (stage.kind === 'preparing' || !build) return { kind: 'plan', candidate, plan };
  return { ...step, stage: { kind: 'ready', build } };
};

export { cancelledStep };
