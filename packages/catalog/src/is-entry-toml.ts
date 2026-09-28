/* @layer core @kind logic */
import { isRecord } from '@archipelia/engine';
import type { EntryToml } from './index-toml.type';

const optionalString = (value: unknown) => value === undefined || typeof value === 'string';

const isEntryToml = (value: unknown): value is EntryToml =>
  isRecord(value) && typeof value.name === 'string'
  && ['display_name', 'home', 'stability', 'setup_guide', 'tracker', 'default_url'].every((key) => optionalString(value[key]))
  && (value.versions === undefined || (isRecord(value.versions) && Object.values(value.versions).every(isRecord)))
  && (value.fuzz_results === undefined || (Array.isArray(value.fuzz_results) && value.fuzz_results.every(isRecord)));

export { isEntryToml };
