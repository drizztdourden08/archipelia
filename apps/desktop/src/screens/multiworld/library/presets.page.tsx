/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { PresetsHub } from '../../../views/PresetsHub';

const meta: ScreenMeta = { title: 'Presets', icon: 'sliders-horizontal', order: 3, keywords: ['options', 'yaml', 'player settings'], menu: 'entry', fill: true };

const PresetsPage = () => <PresetsHub />;

export default PresetsPage;
export { meta };
