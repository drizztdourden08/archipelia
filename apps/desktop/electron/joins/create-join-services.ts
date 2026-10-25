/* @layer electron-main @kind logic */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { apRoot } from '@archipelia/engine';
import type { JoinRequest } from '../../src/joins/joins.type';
import type { JoinServicesDeps } from './joins.type';
import { buildJoinRecord } from './build-join-record';
import { clientInfo } from './client-info';
import { connectJoin } from './connect-join';
import { createJoinService } from './create-join-service';

const readWorld = async (path: string) => new Uint8Array(await readFile(path));

const createJoinServices = ({ core, files, name, version, emit, log }: JoinServicesDeps) => {
  const service = createJoinService({
    files, connect: connectJoin, readWorld, client: clientInfo(name, version), emit,
    engineAp: () => core.runtime().then((runtime) => runtime.apVersion, () => undefined),
  });
  const request = async (input: JoinRequest) => service.start(await buildJoinRecord(input, {
    installed: core.installed, presets: core.presets, readWorld, now: Date.now(),
    worldPath: async (game) => join(apRoot(await core.runtime()), game.path),
  }));
  void service.resumeAll().catch((error: unknown) => log(`the joined sessions did not resume: ${String(error)}`));
  return { ...service, request };
};

export { createJoinServices };
