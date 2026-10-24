/* @layer client-kit @kind logic */
import type { KitIssue } from '../errors/kit-issue.type';
import type { ManifestInput } from './archipelago-manifest.type';
import { compareApVersions } from '../versions/compare-ap-versions';
import { parseApVersion } from '../versions/parse-ap-version';
import { WORLD_VERSION } from './manifest.constants';

const issue = (key: string, message: string): KitIssue => ({ key, code: 'bad-value', message });

const checkVersion = (key: string, value: string | undefined): KitIssue[] =>
  value === undefined || parseApVersion(value) !== null
    ? []
    : [issue(key, `${key} "${value}" is not an Archipelago version such as 0.6.8.`)];

const checkFormat = (key: string, value: number | undefined): KitIssue[] =>
  value === undefined || (Number.isInteger(value) && value >= 1)
    ? []
    : [issue(key, `${key} must be a whole number of 1 or more.`)];

const checkIdentity = ({ game, worldVersion }: ManifestInput): KitIssue[] => {
  const issues: KitIssue[] = [];
  if (typeof game !== 'string' || game.trim() === '') issues.push(issue('game', 'game must be a non-empty text.'));
  if (!WORLD_VERSION.test(worldVersion)) issues.push(issue('worldVersion', `worldVersion "${worldVersion}" must look like 1.2.3.`));
  return issues;
};

const checkOrder = ({ minimumAp, maximumAp, version, compatibleVersion }: ManifestInput): KitIssue[] => {
  const issues: KitIssue[] = [];
  if (maximumAp !== undefined && compareApVersions(minimumAp, maximumAp) > 0) {
    issues.push(issue('maximumAp', `maximumAp ${maximumAp} is older than minimumAp ${minimumAp}.`));
  }
  if (version !== undefined && compatibleVersion !== undefined && compatibleVersion > version) {
    issues.push(issue('compatibleVersion', 'compatibleVersion cannot be above version.'));
  }
  return issues;
};

const checkManifestInput = (input: ManifestInput): KitIssue[] => {
  const { minimumAp, maximumAp, version, compatibleVersion } = input;
  const issues = [
    ...checkIdentity(input),
    ...checkVersion('minimumAp', minimumAp),
    ...checkVersion('maximumAp', maximumAp),
    ...checkFormat('version', version),
    ...checkFormat('compatibleVersion', compatibleVersion),
  ];
  return issues.length > 0 ? issues : checkOrder(input);
};

export { checkManifestInput };
