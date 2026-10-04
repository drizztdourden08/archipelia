/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';

const meta: ScreenMeta = { title: 'archipelago.gg', icon: 'globe', order: 3, keywords: ['website', 'rooms', 'owner', 'online host'] };

const sections: Section[] = [
  {
    id: 'website',
    title: 'Website',
    items: [
      {
        key: 'ggBaseUrl',
        label: 'Site',
        description: 'The Archipelago website that hosts the rooms of sessions run there.',
        hint: 'Change only for a self-hosted copy of the Archipelago website.',
        keywords: 'url self-hosted website address',
        control: { kind: 'text', placeholder: 'https://archipelago.gg' },
      },
    ],
  },
  {
    id: 'owner',
    title: 'Owner id',
    items: [
      {
        key: 'ggOwner',
        label: 'Owner id',
        description: 'Opens the rooms this app owns on the site in the browser, or forgets the private owner id.',
        hint: 'The owner id stays in the vault; forgetting it loses control of its rooms.',
        keywords: 'rooms browser open forget reset vault',
      },
    ],
  },
];

export default sections;
export { meta };
