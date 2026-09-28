/* @layer core @kind logic */
import { isRecord } from '@archipelia/engine';
import type { RootToml } from './index-toml.type';

const isRootToml = (value: unknown): value is RootToml =>
  isRecord(value) && typeof value.archipelago_version === 'string';

export { isRootToml };
