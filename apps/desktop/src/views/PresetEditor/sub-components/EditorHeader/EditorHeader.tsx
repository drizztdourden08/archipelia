/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { Box, Button, ButtonRow, Flex, Status, Tag, TextInput } from '@drizztdourden08/tessera/primitives';
import type { EditorHeaderProps } from './EditorHeader.type';

const EditorHeader = (props: EditorHeaderProps) => {
  const { name, onNameChange, gameLabel, canSave, busy, dirty, onSave, onResetAll, onDuplicate, onDelete, onImport, onExport } = props;
  const handleName = useCallback((event: ChangeEvent<HTMLInputElement>) => onNameChange(event.target.value), [onNameChange]);
  return (
    <Flex gap="md" align="center" justify="between" wrap>
      <Flex gap="sm" align="center" wrap>
        <Box className="preset-editor__name">
          <TextInput aria-label="Preset name" placeholder="Preset name" value={name} onChange={handleName} />
        </Box>
        <Tag>{gameLabel}</Tag>
        {dirty && <Status tone="warning">unsaved</Status>}
      </Flex>
      <ButtonRow align="end">
        <Button variant="ghost" onClick={onDuplicate} disabled={busy}>Duplicate</Button>
        <Button variant="ghost" onClick={onImport} disabled={busy}>Import yaml</Button>
        <Button variant="ghost" onClick={onExport} disabled={busy}>Export yaml</Button>
        <Button variant="danger" onClick={onDelete} disabled={busy}>Delete</Button>
        <Button variant="secondary" onClick={onResetAll} disabled={busy}>Reset all</Button>
        <Button variant="primary" onClick={onSave} disabled={!canSave}>Save</Button>
      </ButtonRow>
    </Flex>
  );
};

export { EditorHeader };
