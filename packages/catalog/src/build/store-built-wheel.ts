/* @layer core @kind logic */
import { randomUUID } from 'node:crypto';
import { copyFile, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import type { PackageSource } from '@archipelia/model';
import { engineTags, wheelFit, wheelRoot } from '@archipelia/engine';
import { hashFile } from '../install/hash-file';
import { storeWheel } from '../wheel/store-wheel';
import { ASSET_NAME, MAX_WHEEL_BYTES, PART_SUFFIX } from '../wheel/wheel.constants';
import type { ActiveBuild } from './build.type';
import { BUILD_TEXT } from './build-text.constants';

const builtFile = async (out: string): Promise<string> => {
  const wheels = (await readdir(out)).filter((name) => name.endsWith('.whl'));
  const [name] = wheels;
  if (wheels.length !== 1 || name === undefined || !ASSET_NAME.test(name)) throw new Error(BUILD_TEXT.oneWheel);
  if ((await stat(join(out, name))).size > MAX_WHEEL_BYTES) throw new Error(BUILD_TEXT.tooLarge);
  return name;
};

const storeBuiltWheel = async (build: ActiveBuild, archiveSha256: string): Promise<PackageSource> => {
  const { runtime, plan, dirs } = build;
  const asset = await builtFile(dirs.out);
  if (!wheelFit(asset, await engineTags(runtime, { signal: build.controller.signal }))) throw new Error(BUILD_TEXT.noFit);
  await mkdir(wheelRoot(runtime), { recursive: true });
  const part = join(wheelRoot(runtime), `${randomUUID()}${PART_SUFFIX}`);
  await copyFile(join(dirs.out, asset), part);
  try {
    const label = { repo: `${plan.owner}/${plan.repo}`, tag: plan.pin.sha, asset, verified: false, newest: undefined, built: true, commit: plan.pin.sha, archiveSha256 };
    return (await storeWheel(runtime, { file: part, sha256: await hashFile(part) }, label, plan.module)).source;
  } catch (err) {
    await rm(part, { force: true });
    throw err;
  }
};

export { storeBuiltWheel };
