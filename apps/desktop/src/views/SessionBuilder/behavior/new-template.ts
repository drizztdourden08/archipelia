/* @layer renderer-app @kind logic */
import { newId } from '@drizztdourden08/brock-core/storage';
import type { SessionTemplate } from '@archipelia/model';
import type { HostingDefaults } from '../SessionBuilder.type';
import { DEFAULT_GENERATOR, DEFAULT_PORT, DEFAULT_SERVER } from '../SessionBuilder.constants';
import { defaultHostOf } from './default-host-of';

const newTemplate = (id: string = newId(), hosting?: HostingDefaults): SessionTemplate => ({
  id,
  name: 'New session',
  players: [],
  generator: { ...DEFAULT_GENERATOR },
  server: { ...(hosting?.server ?? DEFAULT_SERVER) },
  host: hosting ? defaultHostOf(hosting) : { kind: 'local', port: DEFAULT_PORT },
  updatedAt: 0,
});

export { newTemplate };
