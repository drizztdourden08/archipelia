/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { EngineSettings } from '../../../views/EngineSettings';

const meta: ScreenMeta = {
  title: 'Engine',
  icon: 'cpu',
  order: 2,
  keywords: ['archipelago', 'python', 'generator', 'setup', 'rebuild', 'version', 'upgrade', 'downgrade', 'install'],
  searchRows: [
    { label: 'Archipelago version', keywords: ['version', 'ap release', 'upgrade', 'downgrade', 'newer', 'older'], anchor: 'archipelago' },
    { label: 'Python version', keywords: ['version', 'python interpreter', 'downgrade', 'upgrade'], anchor: 'python' },
    { label: 'Change the engine', keywords: ['install', 'switch', 'upgrade', 'apply version'], anchor: 'change' },
    { label: 'Installed engines', keywords: ['engines', 'remove', 'switch', 'active', 'version'], anchor: 'installed' },
  ],
  showHeader: true,
};

const EnginePage = () => <EngineSettings />;

export default EnginePage;
export { meta };
