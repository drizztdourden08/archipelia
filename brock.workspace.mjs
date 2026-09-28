/* @layer root-config @kind config */
import { defineWorkspace, electronTarget, brockProfile } from '@drizztdourden08/brock-thread';
import { engineProvision } from './tooling/engine-bundle/src/provision/index.mjs';

export default defineWorkspace({
  name: 'archipelia',
  base: 'main',
  targets: {
    desktop: electronTarget({ app: 'apps/desktop' }),
  },
  provision: [brockProfile(), engineProvision()],
});
