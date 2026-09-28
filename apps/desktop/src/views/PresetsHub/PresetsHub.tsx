/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { Dialog, MasterDetailLayout } from '@drizztdourden08/tessera/composites';
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
      <Dialog
        open={selection.discardOpen}
        title="Discard changes?"
        message="This preset has unsaved changes. Leave it and lose them?"
        confirmLabel="Discard"
        variant="danger"
        onConfirm={selection.confirmDiscard}
        onCancel={selection.cancelDiscard}
      />
      <Dialog
        open={actions.deleting !== null}
        title="Delete preset?"
        message={`Delete "${actions.deleting?.name ?? ''}"? Sessions that use it will need another preset.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={actions.confirmDelete}
        onCancel={actions.cancelDelete}
      />
    </Box>
  );
};

export { PresetsHub };
