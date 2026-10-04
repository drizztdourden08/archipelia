/* @layer root-config @kind config */
import { defineBrockConfig } from '@drizztdourden08/brock-build/config';

export default defineBrockConfig({
  product: {
    id: 'archipelia',
    name: 'Archipelia',
    appId: 'com.drizztdourden08.archipelia',
    description: 'The Archipelago multiworld workflow in one app.',
    author: { name: 'drizztdourden_', email: 'drizztdourden08@users.noreply.github.com' },
    repo: { owner: 'drizztdourden08', name: 'archipelia' },
    icons: { brand: 'archipelia', rim: 'light' },
  },
  targets: ['desktop'],
  modules: ['secrets', 'updater'],
});
