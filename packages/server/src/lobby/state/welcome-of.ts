/* @layer core @kind logic */
import type { Welcome } from '@drizztdourden08/archipelia-lobby-protocol';
import { PROTOCOL_NAME, PROTOCOL_VERSION } from '@drizztdourden08/archipelia-lobby-protocol';
import { SERVER_NAME } from '../lobby.constants';
import { limitsOf } from './limits-of';
import type { WelcomeInput } from './welcome-of.type';

const welcomeOf = ({ lobby, member, token, need, re, resumed, serverVersion }: WelcomeInput): Welcome => {
  const welcome: Welcome = {
    type: 'welcome',
    protocol: { name: PROTOCOL_NAME, version: PROTOCOL_VERSION },
    server: { name: SERVER_NAME, version: serverVersion },
    lobby: {
      id: lobby.id, name: lobby.name, engine: { ap: lobby.engine.ap }, admission: lobby.options.admission,
      allowUnlisted: lobby.options.allowUnlisted, phase: lobby.phase,
    },
    member: { id: member.id, token, admission: member.admission, trust: member.trust, ...(resumed ? { resumed: true } : {}) },
    need,
    limits: limitsOf(lobby),
  };
  return re === undefined ? welcome : { ...welcome, re };
};

export { welcomeOf };
