/* @layer electron-main @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { onLan } from './on-lan';
import { TEXT } from './sessions.constants';
import type { NetworkSwitch } from './sessions.type';

const assertLanConsent = (server: NetworkSwitch, template: SessionTemplate): void => {
  if (onLan(template) && server.status().options.lanConsent !== true) throw new Error(TEXT.noLanConsent);
};

export { assertLanConsent };
