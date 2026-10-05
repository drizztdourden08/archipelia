/* @layer renderer-app @kind component */
import { Box, Button, EmptyState } from '@drizztdourden08/tessera/primitives';
import { ListDetail } from '@drizztdourden08/tessera/composites';
import { usePresetsHub } from './behavior/usePresetsHub';
import { PresetDetail } from './sub-components/PresetDetail';
import { CreatePresetForm } from './sub-components/CreatePresetForm';
import { FAILURE, NO_GAME, NO_PRESET, PRESET_ROWS } from './PresetsHub.constants';
import './PresetsHub.css';

const PresetsHub = () => {
  const { actions, creator, loadFailed, loading, openGames, retry, rows, schema, selected, selection } = usePresetsHub();
  const create = (close: () => void) => <CreatePresetForm creator={creator} close={close} onOpenGames={openGames} />;
  const error = loadFailed
    ? <>{FAILURE.load} <Button size="sm" variant="secondary" onClick={retry}>Retry</Button></>
    : undefined;

  return (
    <Box className="presets-hub">
      <ListDetail
        list={{
          ...PRESET_ROWS,
          title: 'Presets',
          items: rows,
          create,
          createOpen: creator.open,
          onCreateOpenChange: creator.setOpen,
          createLabel: 'New preset',
          onDelete: actions.removeNow,
          loading,
          error,
          empty: creator.gameOptions.length ? NO_PRESET : NO_GAME,
        }}
        selectedId={selected?.id ?? null}
        onSelect={selection.select}
        dirty={selection.dirty}
        onSave={selection.save}
        onDiscard={selection.discard}
        emptyDetail={<EmptyState message="Pick a preset on the left, or press New preset." />}
        detail={(
          <PresetDetail
            selected={selected}
            schema={schema}
            onOpenGames={openGames}
            onDuplicate={actions.duplicate}
            onDelete={actions.requestDelete}
            onDirtyChange={selection.setDirty}
            onSaveChange={selection.bindSave}
          />
        )}
      />
    </Box>
  );
};

export { PresetsHub };
