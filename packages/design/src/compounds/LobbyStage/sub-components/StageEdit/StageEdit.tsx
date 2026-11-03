/* @layer renderer-app @kind component */
import { Button, Icon, Inline, Text } from '@drizztdourden08/tessera/primitives';
import type { StageEditProps } from './StageEdit.type';

const StageEdit = ({ editLabel, onEdit, locked }: StageEditProps) => {
  if (locked) {
    return (
      <Inline className="lobby-stage__locked" gap="2xs" align="center">
        <Icon name="lock" />
        <Text as="span" variant="caption" tone="dim">{locked}</Text>
      </Inline>
    );
  }
  if (!onEdit || !editLabel) return null;
  return <Button size="sm" variant="ghost" icon={<Icon name="pencil" />} onClick={onEdit}>{editLabel}</Button>;
};

export { StageEdit };
