/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { ReleaseManifest } from './first-party.type';

const isText = (value: unknown): value is string => typeof value === 'string' && value.length > 0;

const isReleaseManifest = (value: unknown): value is ReleaseManifest =>
  isRecord(value)
  && isText(value.game)
  && isText(value.worldVersion)
  && isText(value.minimumAp)
  && isText(value.sha256)
  && isText(value.appVersion)
  && (value.maximumAp === undefined || isText(value.maximumAp));

export { isReleaseManifest };
