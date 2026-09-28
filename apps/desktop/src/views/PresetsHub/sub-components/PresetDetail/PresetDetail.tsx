/* @layer renderer-app @kind component */
import { EmptyState } from '@drizztdourden08/tessera/primitives';
import type { PresetDetailProps } from './PresetDetail.type';
import { MissingGame } from '../MissingGame';
import { PresetEditor } from '../../../PresetEditor';

const PresetDetail = ({ selected, schema, onOpenGames, onDuplicate, onDelete, onDirtyChange }: PresetDetailProps) => {
  if (!selected) return <EmptyState message="Pick a preset on the left, or press New." />;
  if (!schema) return <MissingGame preset={selected} onOpenGames={onOpenGames} onDelete={onDelete} />;
  return (
    <PresetEditor
      key={selected.id}
      preset={selected}
      schema={schema}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      onDirtyChange={onDirtyChange}
    />
  );
};

export { PresetDetail };
