/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Box, Callout, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { SaveBar, ValidationSummary } from '@drizztdourden08/tessera/composites';
import { GameOptionsPanel } from '@archipelia/design';
import { TOUR_TARGET } from '../../hooks/tour-targets.constants';
import { usePresetEditor } from './behavior/usePresetEditor';
import type { PresetEditorProps } from './PresetEditor.type';
import { EditorHeader } from './sub-components/EditorHeader';
import './PresetEditor.css';

const PresetEditor = (props: PresetEditorProps) => {
  const { preset, schema, onDuplicate, onDelete } = props;
  const { bar, busy, clearFocus, draft, focusKey, items, jump, problems, resetAll, revert, save, status, transfer } = usePresetEditor(props);
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
      <ValidationSummary problems={items} onFocusField={jump} />
      <Box data-tour={TOUR_TARGET.presetsOptions}>
        <GameOptionsPanel
          schema={schema}
          values={draft.values}
          onChange={draft.setValue}
          problems={problems}
          onProblem={draft.setProblem}
          focusKey={focusKey}
          onFocused={clearFocus}
        />
      </Box>
      <SaveBar state={bar.state} error={bar.error} onSave={handleSave} onDiscard={revert} />
    </Stack>
  );
};

export { PresetEditor };
