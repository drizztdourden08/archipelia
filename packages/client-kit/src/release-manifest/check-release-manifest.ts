/* @layer client-kit @kind logic */
import type { KitIssue } from '../errors/kit-issue.type';
import type { ReleaseInput, ReleaseWorld } from './release.type';
import { badValue } from '../index-manifest/bad-value';
import { checkBuilds } from '../index-manifest/check-builds';
import { checkHashAndSize } from '../index-manifest/check-hash-and-size';
import { checkModule } from '../index-manifest/check-module';
import { compareApVersions } from '../versions/compare-ap-versions';
import { parseApVersion } from '../versions/parse-ap-version';
import { APWORLD_FILE_NAME, KIT_VERSION_TEXT } from './release.constants';

const checkRange = ({ minimumAp, maximumAp }: ReleaseInput): KitIssue[] => {
  const issues: KitIssue[] = [];
  if (parseApVersion(minimumAp) === null) issues.push(badValue('minimumAp', `minimumAp "${minimumAp}" is not an Archipelago version such as 0.6.8.`));
  if (maximumAp !== undefined && parseApVersion(maximumAp) === null) issues.push(badValue('maximumAp', `maximumAp "${maximumAp}" is not an Archipelago version such as 0.6.8.`));
  const ordered = issues.length === 0 && maximumAp !== undefined && compareApVersions(minimumAp, maximumAp) > 0;
  return ordered ? [badValue('maximumAp', `maximumAp ${maximumAp} is older than minimumAp ${minimumAp}.`)] : issues;
};

const checkWorld = ({ file, sha256, size, bundle }: ReleaseWorld): KitIssue[] => {
  const issues = checkHashAndSize('world', sha256, size).map((issue) => ({ ...issue, key: 'world' }));
  if (!APWORLD_FILE_NAME.test(file)) issues.push(badValue('world', `world: file "${file}" must be a plain file name ending in .apworld.`));
  if (bundle !== undefined && bundle !== `${file}.sigstore.json`) issues.push(badValue('world', `world: bundle must be "${file}.sigstore.json".`));
  return issues;
};

const checkSource = (input: ReleaseInput): KitIssue[] => {
  if (input.builds !== undefined && input.world !== undefined) return [badValue('builds', 'give builds or world, not both.')];
  if (input.builds !== undefined) return checkBuilds(input.builds, input);
  if (input.world !== undefined) return checkWorld(input.world);
  return [badValue('builds', 'give builds or world.')];
};

const checkReleaseManifest = (input: ReleaseInput): KitIssue[] => {
  const issues = checkModule(input.module);
  if (input.appVersion?.trim() === '') issues.push(badValue('appVersion', 'appVersion must be a non-empty text when given.'));
  if (input.kit !== undefined && !KIT_VERSION_TEXT.test(input.kit)) issues.push(badValue('kit', `kit "${input.kit}" must be a version such as 0.2.0.`));
  return [...issues, ...checkRange(input), ...checkSource(input)];
};

export { checkReleaseManifest };
