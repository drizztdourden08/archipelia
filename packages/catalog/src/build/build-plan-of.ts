/* @layer core @kind logic */
import type { SourceBuildPlan } from '@archipelia/model';
import type { ActiveBuild, Archive } from './build.type';

const buildPlanOf = ({ id, plan, pins, rust }: ActiveBuild, { sha256, size }: Archive, confined: boolean): SourceBuildPlan => ({
  buildId: id,
  owner: plan.owner,
  repo: plan.repo,
  module: plan.module,
  commit: plan.pin.sha,
  archiveSha256: sha256,
  size,
  confined,
  rust,
  tools: pins.map(({ name, version, pin }) => ({ name, version, pin })),
});

export { buildPlanOf };
