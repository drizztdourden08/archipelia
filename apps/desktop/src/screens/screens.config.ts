/* @layer renderer-app @kind config */
import { defineScreens } from '@drizztdourden08/brock-react';

export default defineScreens({
  buckets: [
    {
      id: 'multiworld',
      title: 'Multiworld',
      icon: 'layers',
      menu: 'entry',
      groups: [
        { id: 'library', label: 'Library' },
        { id: 'hosting', label: 'Hosting' },
        { id: 'app', label: 'App' },
      ],
    },
    {
      id: 'data',
      title: 'Data',
      icon: 'hard-drive',
      menu: 'entry',
      groups: [
        { id: 'storage', label: 'Storage' },
        { id: 'transfer', label: 'Transfer' },
      ],
    },
  ],
  home: 'multiworld',
  settings: { bucket: 'multiworld' },
});
