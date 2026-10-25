/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { EnrichRecord } from './enrich.type';
import { OPTIONAL_TEXT_KEYS, RECORD_VERSION } from './enrich.constants';

const isOptionalText = (value: unknown) => value === undefined || typeof value === 'string';

const isEnrichRecord = (value: unknown): value is EnrichRecord =>
  isRecord(value) && value.version === RECORD_VERSION && typeof value.stamp === 'string' && typeof value.fetchedAt === 'number'
  && OPTIONAL_TEXT_KEYS.every((key) => isOptionalText(value[key]));

export { isEnrichRecord };
