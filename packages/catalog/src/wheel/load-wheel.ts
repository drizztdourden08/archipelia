/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import { readWheelMetadata } from '@archipelia/engine';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { hashFile } from '../install/hash-file';
import type { LoadedWheel, WheelLabel } from './wheel.type';
import { wheelDir } from './wheel-dir';
import { ASSET_NAME, SOURCE_FILE, TAG_NAME } from './wheel.constants';

const labelOf = (text: string): WheelLabel => {
  const value: unknown = JSON.parse(text);
  if (!isRecord(value)) throw new Error('unreadable');
  const { repo, tag, asset, verified } = value;
  if (typeof repo !== 'string' || typeof tag !== 'string' || !TAG_NAME.test(tag) || typeof asset !== 'string' || !ASSET_NAME.test(asset) || typeof verified !== 'boolean') {
    throw new Error('unreadable');
  }
  return { repo, tag, asset, verified };
};

const loadWheel = async (runtime: EngineRuntime, sha256: string): Promise<LoadedWheel> => {
  const dir = wheelDir(runtime, sha256);
  const missing = new Error('The downloaded wheel is no longer there. Choose the package again.');
  const label = await readFile(join(dir, SOURCE_FILE), 'utf8').then(labelOf, () => undefined);
  if (!label) throw missing;
  const file = join(dir, label.asset);
  if (await hashFile(file).catch(() => undefined) !== sha256) throw new Error('The downloaded wheel changed on disk. Choose the package again.');
  const { name, version, requires } = await readWheelMetadata(file);
  return { source: { ...label, sha256, name, version }, file, requires };
};

export { loadWheel };
