/* @layer electron-main @kind logic */
import { PROTOCOL_NAME, REQUIRED_CAPABILITY, SUPPORTED_PROTOCOL_VERSIONS, WORLD_CAPABILITY } from '@drizztdourden08/archipelia-lobby-protocol';
import type { ClientInfo, Hello } from '@drizztdourden08/archipelia-lobby-protocol';
import type { JoinRecord } from './joins.type';

const helloOf = (record: JoinRecord, client: ClientInfo, ap: string): Omit<Hello, 'seq'> => ({
  type: 'hello',
  protocol: { name: PROTOCOL_NAME, versions: SUPPORTED_PROTOCOL_VERSIONS },
  lobby: { code: record.code },
  resume: record.token ?? null,
  client,
  player: { displayName: record.displayName },
  archipelago: { version: ap },
  capabilities: record.world ? [REQUIRED_CAPABILITY, WORLD_CAPABILITY] : [REQUIRED_CAPABILITY],
  worlds: record.world
    ? [{ game: record.game, module: record.world.module, worldVersion: record.world.worldVersion, sha256: record.world.sha256, size: record.world.size, proof: { method: 'none' } }]
    : [],
  slots: [{ name: record.slotName, game: record.game, yaml: { sha256: record.yaml.sha256, size: record.yaml.size } }],
});

export { helloOf };
