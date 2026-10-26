/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import type { HostingDefaults } from '../SessionBuilder.type';
import { hostOfKind } from './host-of-kind';
import { hostOfValue } from './host-of-value';
import { LOBBY_PREFIX } from './place.constants';
import { withoutPlace } from './without-place';

const withRemote = (template: SessionTemplate, value: string, hosting: HostingDefaults): SessionTemplate => {
  if (!value.startsWith(LOBBY_PREFIX)) return { ...withoutPlace(template), host: hostOfValue(value, hosting.ggBaseUrl) };
  return { ...withoutPlace(template), host: hostOfKind('local', template.host, [], hosting), lobby: { serverId: value.slice(LOBBY_PREFIX.length) } };
};

export { withRemote };
