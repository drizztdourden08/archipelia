/* @layer core @kind logic */
import { isRecord } from '@archipelia/engine';
import type { LockToml } from './index-toml.type';

const isLockToml = (value: unknown): value is LockToml =>
  isRecord(value) && Object.values(value).every((versions) => isRecord(versions)
    && Object.values(versions).every((hash) => typeof hash === 'string'));

export { isLockToml };
