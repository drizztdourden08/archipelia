/* @layer core @kind logic */
import { apRoot, readRuntime } from '@archipelia/engine';
import { resolve, sep } from 'node:path';
import { rm } from 'node:fs/promises';
import type { RemoveWorldParams } from './remove-world.type';
import { listInstalled } from './list-installed';
import { dependentsOf } from '../official/dependents-of';
import { PLACED } from './remove-world.constants';
import { forgetInstalled } from './forget-installed';

const removeWorld = async ({ engineDir, files, apworld }: RemoveWorldParams) => {
  const installed = await listInstalled(files);
  const record = installed.find((game) => game.apworld === apworld);
  if (!record) throw new Error(`${apworld} is not installed`);
  const dependents = dependentsOf(installed, apworld);
  if (dependents.length > 0) throw new Error(`${apworld} is required by ${dependents.join(', ')}`);
  if (!PLACED.test(record.path)) throw new Error(`${apworld}: refusing to remove ${record.path}`);
  const root = apRoot(await readRuntime(engineDir));
  const target = resolve(root, record.path);
  if (!target.startsWith(`${root}${sep}`)) throw new Error(`${apworld}: ${record.path} is outside the engine`);
  await rm(target, { recursive: true, force: true });
  await forgetInstalled(files, apworld);
};

export { removeWorld };
