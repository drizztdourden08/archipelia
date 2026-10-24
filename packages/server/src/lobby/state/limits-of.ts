/* @layer core @kind logic */
import type { Limits } from '@drizztdourden08/archipelia-lobby-protocol';
import { DEFAULT_LIMITS } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Lobby } from '@archipelia/model';

const limitsOf = ({ options }: Lobby): Limits => ({
  maxMessageBytes: DEFAULT_LIMITS.maxMessageBytes,
  chunkBytes: DEFAULT_LIMITS.chunkBytes,
  maxWorldBytes: options.limits.worldBytes,
  maxYamlBytes: options.limits.yamlBytes,
  maxMemberBytes: options.limits.memberBytes,
});

export { limitsOf };
