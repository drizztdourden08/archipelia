/* @layer renderer-app @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { AdminLobbyMember } from '@archipelia/model';

const clientFacts = ({ client }: AdminLobbyMember): FactsPanelFact[] => {
  if (!client) return [];
  const facts: FactsPanelFact[] = [
    { label: 'Client', value: client.name },
    { label: 'Client id', value: client.id, mono: true },
    { label: 'Client version', value: client.version, mono: true },
    { label: 'Archipelago', value: client.archipelago, mono: true },
    { label: 'Platform', value: `${client.platform.os} ${client.platform.arch}` },
  ];
  return client.build ? [...facts, { label: 'Build', value: client.build, mono: true }] : facts;
};

export { clientFacts };
