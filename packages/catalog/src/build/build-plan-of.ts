/* @layer core @kind logic */
import type { SourceBuildPlan } from '@archipelia/model';
import type { ActiveBuild, Archive } from './build.type';

const buildPlanOf = ({ id, plan, pins }: ActiveBuild, { sha256, size }: Archive): SourceBuildPlan => ({
  buildId: id,
  owner: plan.owner,
  repo: plan.repo,
  module: plan.module,
  commit: plan.pin.sha,
  archiveSha256: sha256,
  size,
  tools: pins.map(({ name, version, pin }) => ({ name, version, pin })),
});

export { buildPlanOf };
