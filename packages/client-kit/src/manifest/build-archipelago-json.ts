/* @layer client-kit @kind logic */
import type { ManifestInput } from './archipelago-manifest.type';
import { createIssuesError } from '../errors/create-issues-error';
import { checkManifestInput } from './check-manifest-input';
import { APWORLD_FORMAT_VERSION } from './manifest.constants';

const buildArchipelagoJson = (input: ManifestInput): string => {
  const issues = checkManifestInput(input);
  if (issues.length > 0) throw createIssuesError('invalid-manifest', 'The archipelago.json input is not valid:', issues);
  const { game, worldVersion, minimumAp, maximumAp, authors, version, compatibleVersion } = input;
  const record = {
    game,
    world_version: worldVersion,
    minimum_ap_version: minimumAp,
    ...(maximumAp === undefined ? {} : { maximum_ap_version: maximumAp }),
    ...(authors === undefined ? {} : { authors: [...authors] }),
    version: version ?? APWORLD_FORMAT_VERSION,
    compatible_version: compatibleVersion ?? APWORLD_FORMAT_VERSION,
  };
  return `${JSON.stringify(record, null, 2)}\n`;
};

export { buildArchipelagoJson };
