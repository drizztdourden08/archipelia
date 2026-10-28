/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { STANDARD_FORMAT } from './first-party.constants';
import type { StandardBuild, StandardFile, StandardManifest } from './first-party.type';
import { isOptionalText } from './is-optional-text';
import { APWORLD_FILE, BUNDLE_FILE, MODULE_NAME, SHA256 } from './is-standard-manifest.constants';

const text = (value: unknown): value is string => typeof value === 'string' && value.length > 0;

const matches = (pattern: RegExp, value: unknown): boolean => typeof value === 'string' && pattern.test(value);

const isFile = (value: unknown): value is StandardFile =>
  isRecord(value)
  && matches(APWORLD_FILE, value.file)
  && matches(SHA256, value.sha256)
  && Number.isInteger(value.size)
  && Number(value.size) >= 0
  && (value.bundle === undefined || matches(BUNDLE_FILE, value.bundle));

const isBuild = (value: unknown): value is StandardBuild => isFile(value) && text((value as Partial<StandardBuild>).archipelagoVersion);

const hasOneSource = ({ builds, world }: Record<string, unknown>): boolean => {
  if (builds === undefined) return isFile(world);
  return world === undefined && Array.isArray(builds) && builds.length > 0 && builds.every(isBuild);
};

const isStandardManifest = (value: unknown): value is StandardManifest =>
  isRecord(value)
  && value.format === STANDARD_FORMAT
  && text(value.game)
  && matches(MODULE_NAME, value.module)
  && text(value.worldVersion)
  && text(value.minimumAp)
  && isOptionalText(value.maximumAp)
  && isOptionalText(value.appVersion)
  && hasOneSource(value);

export { isStandardManifest };
