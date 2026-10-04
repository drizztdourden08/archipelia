/* @layer renderer-app @kind config */
import type { BrockAppSettings } from '@drizztdourden08/brock-react';
import { DEFAULT_SETTINGS } from './settings.constants';
import type { AppSettings } from './settings.type';

const SETTINGS: BrockAppSettings<AppSettings> = { defaults: DEFAULT_SETTINGS };

export { SETTINGS };
