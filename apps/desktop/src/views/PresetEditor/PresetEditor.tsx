/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Box, Callout, EmptyState, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { valueOf } from '@archipelia/presets';
import { OptionGroupTabs } from '@archipelia/design';
import { usePresetEditor } from './behavior/usePresetEditor';
import type { PresetEditorProps } from './PresetEditor.type';
import { EditorHeader } from './sub-components/EditorHeader';
import { OptionRow } from './sub-components/OptionRow';
import './PresetEditor.css';

const PresetEditor = (props: PresetEditorProps) => {
  const { preset, schema, onDuplicate, onDelete } = props;
  const { busy, canSave, draft, filter, problems, resetAll, revert, save, status, summary, transfer } = usePresetEditor(props);
  const handleDuplicate = useCallback(() => onDuplicate(preset), [onDuplicate, preset]);
  const handleDelete = useCallback(() => onDelete(preset), [onDelete, preset]);
  const gameLabel = schema.worldVersion ? `${schema.game} · world ${schema.worldVersion}` : schema.game;

  return (
    <Stack gap="md" className="preset-editor">
      <EditorHeader
        name={draft.name}
        onNameChange={draft.setName}
        gameLabel={gameLabel}
        canSave={canSave}
        busy={busy}
        dirty={draft.dirty}
        onSave={save}
        onRevert={revert}
        onResetAll={resetAll}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onImport={transfer.importYaml}
        onExport={transfer.exportYaml}
      />
      {summary && <Box role="alert"><Callout tone="danger">{summary}</Callout></Box>}
      {status?.tone === 'error' && <Box role="alert"><Callout tone="danger">{status.text}</Callout></Box>}
      {status?.tone === 'info' && <Text variant="caption" role="status" className="preset-editor__status">{status.text}</Text>}
      <OptionGroupTabs
        tabs={filter.tabs}
        activeTab={filter.tab}
        onTabChange={filter.setTab}
        query={filter.query}
        onQueryChange={filter.setQuery}
        showAdvanced={filter.showAdvanced}
        onShowAdvancedChange={filter.setShowAdvanced}
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
          />
        ))}
      </Box>
    </Stack>
  );
};

export { PresetEditor };
