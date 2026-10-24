/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { useEngineSettings } from './behavior/useEngineSettings';
import { SECTION_TEXT } from './EngineSettings.constants';
import { InstalledSection } from './sub-components/InstalledSection';
import { StatusSection } from './sub-components/StatusSection';
import { VersionsSection } from './sub-components/VersionsSection';

const EngineSettings = () => {
  const engine = useEngineSettings();
  const { overview, view } = engine;

  return (
    <Stack>
      <Text variant="body">{SECTION_TEXT.intro}</Text>
      {engine.lastError && <ErrorCallout message={engine.lastError} />}
      {overview && (
        <VersionsSection
          overview={overview}
          chosen={engine.chosen}
          plan={engine.plan}
          busy={engine.busy}
          checking={engine.checking}
          onAp={engine.pickAp}
          onPython={engine.pickPython}
          checkAtStart={engine.checkAtStart}
          onApply={engine.apply}
          onCheck={engine.check}
          onCheckAtStart={engine.setCheckAtStart}
        />
      )}
      {overview && (
        <InstalledSection
          engines={overview.installed}
          activeId={overview.active?.id}
          busy={engine.busy}
          onSwitch={engine.switchEngine}
          onRemove={engine.removeEngine}
        />
      )}
      <StatusSection
        state={view.state}
        progress={engine.progress}
        apVersion={view.apVersion}
        dir={view.dir}
        openable={view.openable}
        failure={engine.failure}
        actions={engine.actions}
      />
    </Stack>
  );
};

export { EngineSettings };
