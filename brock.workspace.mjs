/* @layer root-config @kind config */
import { defineWorkspace, electronTarget, brockProfile } from '@drizztdourden08/brock-thread';

export default defineWorkspace({
  name: 'archipelia',
  base: 'main',
  targets: {
    desktop: electronTarget({ app: 'apps/desktop' }),
  },
  provision: [brockProfile()],
});
