/* @layer client-kit @kind logic */
import type { KitIssue } from '../errors/kit-issue.type';
import type { ApworldIndex, IndexInput } from './index.type';
import { createIssuesError } from '../errors/create-issues-error';
import { compareApVersions } from '../versions/compare-ap-versions';
import { recordOf } from './record-of';
import { badValue } from './bad-value';
import { checkBuilds } from './check-builds';
import { checkModule } from './check-module';

const checkIndex = (input: IndexInput): KitIssue[] => {
  const issues = checkModule(input.module);
  if (input.appVersion.trim() === '') issues.push(badValue('appVersion', 'appVersion must be a non-empty text.'));
  return [...issues, ...checkBuilds(input.builds, input)];
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
