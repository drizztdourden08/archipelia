/* @layer electron-main @kind logic */
import type { BrowseHandle } from '@archipelia/server/network';
import { createNodeNetworkPorts, startBrowser } from '@archipelia/server/network';
import type { LanEntry } from '../../src/lobbies/lobbies.type';
import type { LanBrowserDeps } from './lobbies.type';

const createLanBrowser = ({ automation, selfId, onChange, log }: LanBrowserDeps) => {
  let handle: BrowseHandle | null = null;

  const list = (): LanEntry[] => (handle?.list() ?? []).map((server) => ({ ...server, self: server.id === selfId() }));

  const browse = async (on: boolean): Promise<LanEntry[]> => {
    if (on && !handle) {
      handle = await startBrowser({
        ports: createNodeNetworkPorts(), automation, onChange: () => onChange(list()),
        onError: (source, error) => log(`LAN list (${source}): ${error.message}`),
      });
    }
    if (!on && handle) {
      const stopping = handle;
      handle = null;
      await stopping.stop();
    }
    return list();
  };

  return { browse };
};

export { createLanBrowser };
