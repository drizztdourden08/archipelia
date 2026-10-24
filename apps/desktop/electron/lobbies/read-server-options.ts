/* @layer electron-main @kind logic */
import type { DataFiles } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import { isNetworkMode } from '@archipelia/server/network';
import { DEFAULT_SERVER_OPTIONS, SERVER_OPTIONS_FILE } from '../../src/lobbies/lobbies.constants';
import type { LobbyServerOptions } from '../../src/lobbies/lobbies.type';

const readServerOptions = async (files: DataFiles): Promise<LobbyServerOptions> => {
  const stored = await files.readJson<unknown>(SERVER_OPTIONS_FILE, null).catch(() => null);
  if (!isRecord(stored)) return DEFAULT_SERVER_OPTIONS;
  return {
    mode: isNetworkMode(stored.mode) ? stored.mode : DEFAULT_SERVER_OPTIONS.mode,
    publicLookup: typeof stored.publicLookup === 'boolean' ? stored.publicLookup : DEFAULT_SERVER_OPTIONS.publicLookup,
  };
};

export { readServerOptions };
