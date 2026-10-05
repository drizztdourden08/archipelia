/* @layer renderer-app @kind component */
import type { PresetDetailProps } from './PresetDetail.type';
import { MissingGame } from '../MissingGame';
import { PresetEditor } from '../../../PresetEditor';

const PresetDetail = ({ selected, schema, onOpenGames, onDuplicate, onDelete, onDirtyChange, onSaveChange }: PresetDetailProps) => {
  if (!selected) return null;
  if (!schema) return <MissingGame preset={selected} onOpenGames={onOpenGames} onDelete={onDelete} />;
  return (
    <PresetEditor
      key={selected.id}
      preset={selected}
      schema={schema}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      onDirtyChange={onDirtyChange}
      onSaveChange={onSaveChange}
    />
  );
};

export { PresetDetail };
