/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import { settingsGroupsOf } from '../../behavior/settings-groups-of';
import type { SettingsPanelProps } from './SettingsPanel.type';
import './SettingsPanel.css';

const SettingsPanel = ({ log }: SettingsPanelProps) => {
  const groups = useMemo(() => settingsGroupsOf(log), [log]);
  return (
    <Box className="spoiler-settings">
      {groups.map(({ key, title, facts }) => (
        <Box key={key} className="spoiler-settings__group">
          <Text variant="overline" tone="dim">{title}</Text>
          <FactsPanel groups={[facts]} label={title} framed />
        </Box>
      ))}
    </Box>
  );
};

export { SettingsPanel };
