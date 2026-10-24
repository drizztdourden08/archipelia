/* @layer client-kit @kind logic */
import type { KitIssue } from '../errors/kit-issue.type';
import type { ApworldBuildRecord, ApworldIndex, IndexBuildInput, IndexInput } from './index.type';
import { createIssuesError } from '../errors/create-issues-error';
import { MODULE_NAME } from '../manifest/manifest.constants';
import { checkWorldFit } from '../versions/check-world-fit';
import { compareApVersions } from '../versions/compare-ap-versions';
import { parseApVersion } from '../versions/parse-ap-version';
import { apworldNames } from './apworld-names';
import { SHA256_HEX } from './index.constants';

const issue = (key: string, message: string): KitIssue => ({ key, code: 'bad-value', message });

const checkBuild = (build: IndexBuildInput, input: IndexInput): KitIssue[] => {
  const { archipelagoVersion, sha256, size } = build;
  const label = `build ${archipelagoVersion}`;
  if (parseApVersion(archipelagoVersion) === null) return [issue('builds', `${label}: not an Archipelago version such as 0.6.8.`)];
  const issues: KitIssue[] = [];
  if (!SHA256_HEX.test(sha256)) issues.push(issue('builds', `${label}: sha256 must be 64 lowercase hex characters.`));
  if (!Number.isInteger(size) || size <= 0) issues.push(issue('builds', `${label}: size must be a positive whole number of bytes.`));
  const { game, worldVersion, minimumAp, maximumAp } = input;
  const fit = checkWorldFit({ game, worldVersion, minimumAp, maximumAp }, archipelagoVersion);
  if (!fit.fits) issues.push(issue('builds', `${label}: ${fit.message}`));
  return issues;
};

const checkIndex = (input: IndexInput): KitIssue[] => {
  const issues: KitIssue[] = [];
  if (!MODULE_NAME.test(input.module)) issues.push(issue('module', `module "${input.module}" must be a Python package name.`));
  if (input.appVersion.trim() === '') issues.push(issue('appVersion', 'appVersion must be a non-empty text.'));
  if (input.builds.length === 0) issues.push(issue('builds', 'at least one build is needed.'));
  const versions = input.builds.map((build) => build.archipelagoVersion);
  if (new Set(versions).size !== versions.length) issues.push(issue('builds', 'two builds name the same Archipelago version.'));
  return [...issues, ...input.builds.flatMap((build) => checkBuild(build, input))];
};

const recordOf = (module: string, { archipelagoVersion, sha256, size }: IndexBuildInput): ApworldBuildRecord => {
  const { file, bundle } = apworldNames(module, archipelagoVersion);
  return { archipelagoVersion, file, sha256, size, bundle };
};

const buildApworldIndex = (input: IndexInput): ApworldIndex => {
  const issues = checkIndex(input);
  if (issues.length > 0) throw createIssuesError('invalid-index', 'The apworld index input is not valid:', issues);
  const { game, module, worldVersion, appVersion, minimumAp, maximumAp, builds } = input;
  const ordered = [...builds].sort((a, b) => compareApVersions(a.archipelagoVersion, b.archipelagoVersion));
  return {
    game,
    module,
    worldVersion,
    appVersion,
    minimumAp,
    ...(maximumAp === undefined ? {} : { maximumAp }),
    builds: ordered.map((build) => recordOf(module, build)),
  };
};

export { buildApworldIndex };
