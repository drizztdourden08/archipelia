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
        { id: 'top', label: '' },
        { id: 'library', label: 'Library' },
        { id: 'hosting', label: 'Hosting' },
        { id: 'app', label: 'App' },
      ],
    },
  ],
  home: 'multiworld',
  settings: { bucket: 'multiworld', page: 'general' },
});
