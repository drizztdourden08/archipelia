/* @layer renderer-app @kind component */
import type { TabContext } from '../settings.type';
import { GgSettings } from '../views/GgSettings';

const renderGgTab = ({ settings, onChange }: TabContext) => <GgSettings settings={settings} onChange={onChange} />;

export { renderGgTab };
