/* @layer electron-main @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { assertLanConsent } from './assert-lan-consent';
import { onLan } from './on-lan';
import type { NetworkSwitch } from './sessions.type';

const openToNetwork = (server: NetworkSwitch) => async (template: SessionTemplate): Promise<void> => {
  assertLanConsent(server, template);
  if (!onLan(template) || !template.direct) return;
  const { options } = server.status();
  if (options.mode === 'off') await server.apply({ ...options, mode: 'lan' });
};

export { openToNetwork };
