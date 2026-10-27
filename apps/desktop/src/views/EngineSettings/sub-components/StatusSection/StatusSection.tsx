/* @layer renderer-app @kind component */
import { SettingActions } from '@drizztdourden08/brock-react';
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import { Button, Flex, Icon, ProgressBar, Stack, StatRow, Status, Text } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { TOUR_TARGET } from '../../../../hooks/tour-targets.constants';
import { openEngineFolder } from '../../behavior/open-engine-folder';
import { SECTION_TEXT } from '../../EngineSettings.constants';
import type { StatusSectionProps } from './StatusSection.type';

const StatusSection = ({ state, progress, apVersion, dir, openable, failure, actions }: StatusSectionProps) => (
  <SettingsSection id="status" title={SECTION_TEXT.status.title} description={SECTION_TEXT.status.description}>
    <Stack>
      <Stack gap="xs" data-tour={TOUR_TARGET.engineStatus}>
        <Status tone={state.tone}>{state.label}</Status>
        {progress && <ProgressBar value={progress.percent} label="Engine setup" showValue live />}
        {progress && <Text variant="caption">{progress.step}</Text>}
      </Stack>
      <StatRow label="Archipelago" value={apVersion} />
      <Flex gap="sm" align="center" wrap>
        <StatRow label="Folder" value={dir} />
        <Button size="sm" variant="secondary" icon={<Icon name="folder-open" />} disabled={!openable} onClick={() => { void openEngineFolder(dir); }}>Open folder</Button>
      </Flex>
      {failure && <ErrorCallout message={failure} />}
      <SettingActions actions={actions} align="start" />
    </Stack>
  </SettingsSection>
);

export { StatusSection };
