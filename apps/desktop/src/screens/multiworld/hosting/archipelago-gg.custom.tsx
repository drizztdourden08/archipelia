/* @layer renderer-app @kind component */
import { useSettings } from '@drizztdourden08/brock-react';
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import type { AppSettings } from '../../../settings.type';
import { GgSettings } from '../../../views/GgSettings';

const meta: ScreenMeta = { title: 'archipelago.gg', icon: 'globe', order: 3, keywords: ['website', 'rooms', 'owner', 'online host'] };

const searchEntries: SearchEntrySeed[] = [
  { label: 'Site', keywords: ['url', 'self-hosted', 'website'], anchor: 'site', description: 'Change only for a self-hosted copy of the Archipelago website.' },
  { label: 'Open my rooms in the browser', keywords: ['rooms', 'owner id', 'browser'], anchor: 'owner', description: 'Lists the rooms this app owns on the site.' },
  { label: 'Forget the owner id', keywords: ['reset', 'vault', 'owner id'], anchor: 'owner', description: 'Removes the private owner id from the vault.' },
];

const ArchipelagoGgPage = () => {
  const { settings, patch } = useSettings<AppSettings>();
  return <GgSettings settings={settings} onChange={patch} />;
};

export default ArchipelagoGgPage;
export { meta, searchEntries };
