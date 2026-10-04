/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { MasterDetailLayout } from '@drizztdourden08/tessera/composites';
import { usePresetsHub } from './behavior/usePresetsHub';
import { PresetList } from './sub-components/PresetList';
import { PresetDetail } from './sub-components/PresetDetail';
import { CreatePresetDialog } from './sub-components/CreatePresetDialog';
import './PresetsHub.css';

const PresetsHub = () => {
  const { actions, creator, error, groups, loading, openGames, openNew, schema, selected, selection, total } = usePresetsHub();

  return (
    <Box className="presets-hub">
      <MasterDetailLayout
        detailEmpty={!selected}
        list={(
          <PresetList
            groups={groups}
            total={total}
            selectedId={selection.selectedId}
            loading={loading}
            error={error}
            canCreate={creator.gameOptions.length > 0}
            onSelect={selection.select}
            onNew={openNew}
            onOpenGames={openGames}
          />
        )}
        detail={(
          <PresetDetail
            selected={selected}
            schema={schema}
            onOpenGames={openGames}
            onDuplicate={actions.duplicate}
            onDelete={actions.requestDelete}
            onDirtyChange={selection.setDirty}
          />
        )}
      />
      <CreatePresetDialog creator={creator} />
    </Box>
  );
};

export { PresetsHub };
