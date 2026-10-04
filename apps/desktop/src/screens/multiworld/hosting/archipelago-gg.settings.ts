/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { FORGET_OWNER_CONFIRM } from '../../../gg-owner/gg-owner.constants';
import { forgetGgOwner } from '../../../gg-owner/forget-gg-owner';
import { openGgRooms } from '../../../gg-owner/open-gg-rooms';
import type { AppSettings } from '../../../settings.type';

const meta: ScreenMeta = { title: 'archipelago.gg', icon: 'globe', order: 3, keywords: ['website', 'rooms', 'owner', 'online host'] };

const sections = (settings: AppSettings): Section[] => [
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
        description: 'The site has no accounts: rooms belong to a private owner id that Archipelia keeps in the vault, so only this app can command them or read their logs.',
        hint: 'Forgetting the owner id loses control of its rooms. One is made the first time a session runs there.',
        keywords: 'rooms browser open forget reset vault',
        actions: [
          { id: 'open-rooms', label: 'Open my rooms', icon: 'external-link', onSelect: () => openGgRooms(settings.ggBaseUrl) },
          { id: 'forget-owner', label: 'Forget the owner id', icon: 'trash-2', variant: 'danger', confirm: FORGET_OWNER_CONFIRM, onSelect: forgetGgOwner },
        ],
      },
    ],
  },
];

export default sections;
export { meta };
