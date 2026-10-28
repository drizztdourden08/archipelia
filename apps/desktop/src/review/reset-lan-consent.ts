/* @layer renderer-app @kind logic */
import { appApi } from '../ipc/app-api';

const resetLanConsent = async (): Promise<void> => {
  const api = appApi();
  const { options } = await api.lobbyServerStatus();
  if (options.lanConsent === true) await api.lobbyServerApply({ ...options, lanConsent: false });
};

export { resetLanConsent };
