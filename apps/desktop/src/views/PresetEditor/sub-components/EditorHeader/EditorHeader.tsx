/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { DropdownMenu } from '@drizztdourden08/tessera/composites';
import { Box, Button, ButtonRow, Flex, Status, Tag, TextInput } from '@drizztdourden08/tessera/primitives';
import type { EditorHeaderProps } from './EditorHeader.type';
import { MORE_TRIGGER } from './EditorHeader.constants';
import { moreActions } from '../../behavior/more-actions';

const EditorHeader = (props: EditorHeaderProps) => {
  const { name, onNameChange, gameLabel, canSave, busy, dirty, onSave, onRevert, onResetAll, onDuplicate, onDelete, onImport, onExport } = props;
  const handleName = useCallback((event: ChangeEvent<HTMLInputElement>) => onNameChange(event.target.value), [onNameChange]);
  const groups = useMemo(
    () => moreActions({ busy, onDuplicate, onImport, onExport, onResetAll, onDelete }),
    [busy, onDuplicate, onImport, onExport, onResetAll, onDelete],
  );
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
        <Button variant="secondary" onClick={onRevert} disabled={busy || !dirty}>Revert</Button>
        <Button variant="primary" onClick={onSave} disabled={!canSave}>Save</Button>
        <DropdownMenu trigger={MORE_TRIGGER} variant="secondary" intensity="medium" groups={groups} />
      </ButtonRow>
    </Flex>
  );
};

export { EditorHeader };
