/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Box, Callout, EmptyState, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { FormGroupTabs, SaveBar } from '@drizztdourden08/tessera/composites';
import { valueOf } from '@archipelia/presets';
import { usePresetEditor } from './behavior/usePresetEditor';
import type { PresetEditorProps } from './PresetEditor.type';
import { EditorHeader } from './sub-components/EditorHeader';
import { OptionRow } from './sub-components/OptionRow';
import './PresetEditor.css';

const PresetEditor = (props: PresetEditorProps) => {
  const { preset, schema, onDuplicate, onDelete } = props;
  const { bar, busy, draft, filter, problems, resetAll, revert, save, status, transfer } = usePresetEditor(props);
  const handleDuplicate = useCallback(() => onDuplicate(preset), [onDuplicate, preset]);
  const handleDelete = useCallback(() => onDelete(preset), [onDelete, preset]);
  const handleSave = useCallback(() => { void save(); }, [save]);
  const gameLabel = schema.worldVersion ? `${schema.game} · world ${schema.worldVersion}` : schema.game;

  return (
    <Stack gap="md" className="preset-editor">
      <EditorHeader
        name={draft.name}
        onNameChange={draft.setName}
        gameLabel={gameLabel}
        busy={busy}
        onResetAll={resetAll}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onImport={transfer.importYaml}
        onExport={transfer.exportYaml}
      />
      {status?.tone === 'error' && <Box role="alert"><Callout tone="danger">{status.text}</Callout></Box>}
      {status?.tone === 'info' && <Text variant="caption" role="status" className="preset-editor__status">{status.text}</Text>}
      <FormGroupTabs
        tabs={filter.tabs}
        activeTab={filter.tab}
        onTabChange={filter.setTab}
        query={filter.query}
        onQueryChange={filter.setQuery}
        advanced={filter.showAdvanced}
        onAdvancedChange={filter.advanced > 0 ? filter.setShowAdvanced : undefined}
        advancedCount={filter.advanced}
      />
      <Box>
        {filter.visible.length === 0 && <EmptyState message="No option matches here." />}
        {filter.visible.map((def) => (
          <OptionRow
            key={def.key}
            def={def}
            value={valueOf(draft.values, def)}
            problem={problems.get(def.key)}
            onValue={draft.setValue}
            onReset={draft.resetValue}
            onProblem={draft.setProblem}
          />
        ))}
      </Box>
      <SaveBar state={bar.state} error={bar.error} onSave={handleSave} onDiscard={revert} />
    </Stack>
  );
};

export { PresetEditor };
