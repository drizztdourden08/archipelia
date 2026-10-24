/* @layer renderer-app @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { LobbyServerEntry } from '@archipelia/model';
import { formatPin } from '../../../lobbies/format-pin';
import type { LobbyServerTest } from '../../../lobbies/lobbies.type';
import { NO_PIN } from '../ArchipeliaServers.constants';

const remoteFacts = (entry: LobbyServerEntry, test: LobbyServerTest | undefined): FactsPanelFact[] => {
  const facts: FactsPanelFact[] = [
    { label: 'Address', value: entry.url, mono: true, copyable: 'server address' },
    entry.certSha256
      ? { label: 'Certificate pin', value: formatPin(entry.certSha256), mono: true, copyable: 'certificate pin' }
      : { label: 'Certificate pin', value: NO_PIN },
  ];
  if (test?.info) facts.push({ label: 'Server', value: `${test.info.name} ${test.info.version}` }, { label: 'Lobby TLS', value: test.info.tls ? 'On' : 'Off' });
  const last = test?.message ?? entry.lastTest?.message;
  return last ? [...facts, { label: 'Last test', value: last }] : facts;
};

export { remoteFacts };
