/* @layer renderer-app @kind logic */
import { appApi } from '../ipc/app-api';
import { useServerStatusStore } from '../stores/useServerStatusStore';

const resetLan = async (): Promise<void> => {
  const api = appApi();
  const current = await api.lobbyServerStatus();
  const { options } = current;
  const clean = options.mode === 'off' && options.lanConsent !== true;
  const status = clean ? current : await api.lobbyServerApply({ ...options, mode: 'off', lanConsent: false });
  useServerStatusStore.getState().setStatus(status);
};

export { resetLan };
