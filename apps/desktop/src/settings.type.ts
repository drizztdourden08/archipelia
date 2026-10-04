/* @layer renderer-app @kind types */
import type { BaseSettings } from '@drizztdourden08/brock-core';
import type { Section, SettingItem } from '@drizztdourden08/brock-react';
import type { ReleaseMode, RemainingMode } from '@archipelia/model';

interface AppSettings extends BaseSettings {
  hostingDefaultHost: 'local' | 'archipelago-gg';
  hostingLocalPort: number;
  hostingHintCost: number;
  hostingReleaseMode: ReleaseMode;
  hostingCollectMode: ReleaseMode;
  hostingRemainingMode: RemainingMode;
  hostingAutoShutdownMinutes: number;
  ggBaseUrl: string;
}

interface SettingsRow extends SettingItem {
  hint: string;
}

interface SettingsSection extends Omit<Section, 'items' | 'subsections'> {
  items: SettingsRow[];
}

type NumberSettingKey = 'hostingLocalPort' | 'hostingAutoShutdownMinutes';

interface NumberBounds {
  min: number;
  max?: number;
}

export type { AppSettings, NumberBounds, NumberSettingKey, SettingsSection };
