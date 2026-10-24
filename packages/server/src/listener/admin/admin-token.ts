/* @layer core @kind logic */
import { chmod } from 'node:fs/promises';
import { newToken } from '@archipelia/lobby-protocol/node';
import type { DataFiles } from '@archipelia/model';
import { ADMIN_TOKEN_FILE, OWNER_ONLY } from './admin.constants';

const adminToken = (files: DataFiles, log: (message: string) => void) => {
  let token: Promise<string> | undefined;
  const load = async () => {
    const stored = (await files.readText(ADMIN_TOKEN_FILE))?.trim();
    if (stored) return stored;
    const created = newToken();
    await files.writeText(ADMIN_TOKEN_FILE, created);
    await chmod(files.path(ADMIN_TOKEN_FILE), OWNER_ONLY).catch(() => undefined);
    log(`A new admin token for this server is in ${files.path(ADMIN_TOKEN_FILE)}.`);
    return created;
  };
  return () => {
    token ??= load();
    return token;
  };
};

export { adminToken };
