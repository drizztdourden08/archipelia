/* @layer renderer-app @kind component */
import type { TabContext } from '../settings.type';
import { HostingSettings } from '../views/HostingSettings';

const renderHostingTab = ({ settings, onChange }: TabContext) => <HostingSettings settings={settings} onChange={onChange} />;

export { renderHostingTab };
