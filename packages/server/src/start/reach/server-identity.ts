/* @layer core @kind logic */
import { randomBytes } from 'node:crypto';
import { hostname } from 'node:os';
import type { DataFiles } from '@archipelia/model';
import { SERVER_NAME } from '../../lobby/lobby.constants';
import { NON_PRINTABLE, SERVER_ID_BYTES, SERVER_ID_FILE, SERVER_NAME_MAX } from './reach.constants';

const nameOf = () => `${SERVER_NAME} on ${hostname().replace(NON_PRINTABLE, '')}`.slice(0, SERVER_NAME_MAX);

const serverIdentity = async (files: DataFiles): Promise<{ id: string; name: string }> => {
  const stored = (await files.readText(SERVER_ID_FILE))?.trim();
  if (stored) return { id: stored, name: nameOf() };
  const id = `srv_${randomBytes(SERVER_ID_BYTES).toString('hex')}`;
  await files.writeText(SERVER_ID_FILE, id);
  return { id, name: nameOf() };
};

export { serverIdentity };
