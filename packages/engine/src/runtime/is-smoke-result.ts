/* @layer core @kind logic */
import type { SmokeResult } from '@archipelia/model';
import { isRecord, isStringList } from '@archipelia/model';
import { SMOKE_FAILURES } from './engine-meta.constants';

const isSmokeResult = (value: unknown): value is SmokeResult =>
  isRecord(value) &&
  typeof value.ok === 'boolean' &&
  typeof value.at === 'number' &&
  isStringList(value.warnings) &&
  (value.failed === undefined || SMOKE_FAILURES.includes(value.failed));

export { isSmokeResult };
