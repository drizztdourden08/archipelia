/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { RootToml } from './index-toml.type';

const isRootToml = (value: unknown): value is RootToml =>
  isRecord(value) && typeof value.archipelago_version === 'string';

export { isRootToml };
