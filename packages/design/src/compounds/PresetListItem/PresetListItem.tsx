/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import { Status } from '@drizztdourden08/tessera/primitives';
import type { PresetListItemProps } from './PresetListItem.type';

const PresetListItem = ({ id, name, meta, selected, unavailable, onSelect }: PresetListItemProps) => {
  const handleClick = useCallback(() => onSelect(id), [id, onSelect]);
  return (
    <ListItemRow
      actionVisibility="always"
      name={name}
      meta={meta}
      selected={selected}
      onClick={handleClick}
      action={unavailable ? <Status tone="neutral">not installed</Status> : undefined}
    />
  );
};

export { PresetListItem };
