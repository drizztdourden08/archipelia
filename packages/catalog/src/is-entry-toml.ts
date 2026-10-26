/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { EntryToml } from './index-toml.type';

const optionalString = (value: unknown) => value === undefined || typeof value === 'string';

const optionalLinks = (value: unknown) => optionalString(value) || (Array.isArray(value) && value.every((item) => typeof item === 'string'));

const isEntryToml = (value: unknown): value is EntryToml =>
  isRecord(value) && typeof value.name === 'string'
  && ['display_name', 'stability', 'setup_guide', 'tracker', 'default_url'].every((key) => optionalString(value[key])) && optionalLinks(value.home)
  && (value.versions === undefined || (isRecord(value.versions) && Object.values(value.versions).every(isRecord)))
  && (value.fuzz_results === undefined || (Array.isArray(value.fuzz_results) && value.fuzz_results.every(isRecord)));

export { isEntryToml };
