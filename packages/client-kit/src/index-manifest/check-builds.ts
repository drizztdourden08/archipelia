/* @layer client-kit @kind logic */
import type { KitIssue } from '../errors/kit-issue.type';
import type { WorldRange } from '../versions/world-fit.type';
import type { IndexBuildInput } from './index.type';
import { checkWorldFit } from '../versions/check-world-fit';
import { parseApVersion } from '../versions/parse-ap-version';
import { badValue } from './bad-value';
import { checkHashAndSize } from './check-hash-and-size';

const checkBuild = (build: IndexBuildInput, range: WorldRange): KitIssue[] => {
  const { archipelagoVersion, sha256, size } = build;
  const label = `build ${archipelagoVersion}`;
  if (parseApVersion(archipelagoVersion) === null) return [badValue('builds', `${label}: not an Archipelago version such as 0.6.8.`)];
  const issues = checkHashAndSize(label, sha256, size);
  const fit = checkWorldFit(range, archipelagoVersion);
  if (!fit.fits) issues.push(badValue('builds', `${label}: ${fit.message}`));
  return issues;
};

const checkBuilds = (builds: readonly IndexBuildInput[], range: WorldRange): KitIssue[] => {
  const issues: KitIssue[] = [];
  if (builds.length === 0) issues.push(badValue('builds', 'at least one build is needed.'));
  const versions = builds.map((build) => build.archipelagoVersion);
  if (new Set(versions).size !== versions.length) issues.push(badValue('builds', 'two builds name the same Archipelago version.'));
  return [...issues, ...builds.flatMap((build) => checkBuild(build, range))];
};

export { checkBuilds };
