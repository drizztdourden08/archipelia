/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { EngineSettings } from '../../../views/EngineSettings';

const meta: ScreenMeta = { title: 'Engine', icon: 'cpu', order: 2, keywords: ['archipelago', 'python', 'generator', 'setup', 'rebuild'] };

const EnginePage = () => <EngineSettings />;

export default EnginePage;
export { meta };
