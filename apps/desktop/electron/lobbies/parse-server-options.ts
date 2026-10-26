/* @layer electron-main @kind logic */
import { isRecord } from '@archipelia/model';
import { isNetworkMode } from '@archipelia/server/network';
import type { LobbyServerOptions } from '../../src/lobbies/lobbies.type';

const parseServerOptions = (value: unknown): LobbyServerOptions | null => {
  if (!isRecord(value) || !isNetworkMode(value.mode) || typeof value.publicLookup !== 'boolean') return null;
  return { mode: value.mode, publicLookup: value.publicLookup, ...(value.lanConsent === true ? { lanConsent: true } : {}) };
};

export { parseServerOptions };
