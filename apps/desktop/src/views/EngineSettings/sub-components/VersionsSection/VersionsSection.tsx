/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import { Box } from '@drizztdourden08/tessera/primitives';
import { TOUR_TARGET } from '../../../../hooks/tour-targets.constants';
import { versionRows } from '../../behavior/version-rows';
import { whenText } from '../../behavior/when-text';
import { SECTION_TEXT } from '../../EngineSettings.constants';
import { DependencyList } from '../DependencyList';
import { VersionTag } from '../VersionTag';
import type { VersionsSectionProps } from './VersionsSection.type';

const VersionsSection = ({ overview, chosen, plan, busy, checking, checkAtStart, onAp, onPython, onApply, onCheck, onCheckAtStart }: VersionsSectionProps) => {
  const rows = useMemo(
    () => versionRows({
      overview, chosen, plan, busy, checking, onAp, onPython, onApply, onCheck, checkAtStart, onCheckAtStart,
      tag: <VersionTag tag={overview.tag} feed={overview.feed} />,
      dependencies: <DependencyList packages={overview.active?.packages ?? []} rules={overview.active?.rules ?? []} />,
      when: whenText,
    }),
    [overview, chosen, plan, busy, checking, checkAtStart, onAp, onPython, onApply, onCheck, onCheckAtStart],
  );
  return (
    <Box data-tour={TOUR_TARGET.engineVersions}>
      <SettingsSection id="versions" title={SECTION_TEXT.versions.title} description={SECTION_TEXT.versions.description} rows={rows} />
    </Box>
  );
};

export { VersionsSection };
