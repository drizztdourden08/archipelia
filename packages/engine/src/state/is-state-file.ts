/* @layer core @kind logic */
import type { EngineStateFile } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import { STATE_VERSION } from './engine-state.constants';

const isInstalled = (value: unknown): boolean =>
  isRecord(value) && ['id', 'ap', 'python', 'target'].every((key) => typeof value[key] === 'string');

const isStateFile = (value: unknown): value is EngineStateFile =>
  isRecord(value) && value.version === STATE_VERSION && Array.isArray(value.installed) && value.installed.every(isInstalled);

export { isStateFile };
