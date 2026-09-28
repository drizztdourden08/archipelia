/* @layer renderer-app @kind types */
import type { AppSettings } from '../../settings.type';

type HostingSettingsProps = { settings: AppSettings; onChange: (patch: Partial<AppSettings>) => void };

export type { HostingSettingsProps };
