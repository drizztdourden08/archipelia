/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import type { PlaceContext, SessionPlace } from '../SessionBuilder.type';
import { hostOfKind } from './host-of-kind';
import { remoteHost } from './remote-host';
import { withoutPlace } from './without-place';

const onThisComputer = (template: SessionTemplate, lan: boolean, { hosting }: PlaceContext): SessionTemplate =>
  ({ ...withoutPlace(template), host: hostOfKind('local', template.host, [], hosting), ...(lan ? { lan } : {}) });

const onRemote = (template: SessionTemplate, { lobbyServers, servers, hosting }: PlaceContext): SessionTemplate => {
  const first = lobbyServers[0];
  if (!template.direct) return { ...withoutPlace(template), host: remoteHost(template.host, servers, hosting.ggBaseUrl) };
  return first ? { ...withoutPlace(template), host: hostOfKind('local', template.host, [], hosting), lobby: { serverId: first.id } } : template;
};

const withPlace = (template: SessionTemplate, place: SessionPlace, context: PlaceContext): SessionTemplate =>
  (place === 'remote' ? onRemote(template, context) : onThisComputer(template, place === 'lan', context));

export { withPlace };
