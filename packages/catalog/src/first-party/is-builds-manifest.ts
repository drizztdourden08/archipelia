/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { isOptionalText } from './is-optional-text';
import type { BuildRecord, BuildsManifest } from './first-party.type';

const isText = (value: unknown): value is string => typeof value === 'string' && value.length > 0;

const isBuildRecord = (value: unknown): value is BuildRecord =>
  isRecord(value)
  && isText(value.archipelagoVersion)
  && isText(value.file)
  && isText(value.sha256)
  && isText(value.bundle)
  && typeof value.size === 'number'
  && Number.isInteger(value.size)
  && value.size >= 0;

const isBuildsManifest = (value: unknown): value is BuildsManifest =>
  isRecord(value)
  && isText(value.game)
  && isText(value.worldVersion)
  && isText(value.appVersion)
  && isOptionalText(value.minimumAp)
  && isOptionalText(value.maximumAp)
  && Array.isArray(value.builds)
  && value.builds.length > 0
  && value.builds.every(isBuildRecord);

export { isBuildsManifest };
