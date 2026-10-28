/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { DropdownMenu } from '@drizztdourden08/tessera/composites';
import type { MenuGroup } from '@drizztdourden08/tessera/composites';
import type { SessionMenuProps } from './SessionMenu.type';

const SessionMenu = ({ id, name, busy, onDuplicate, onDelete }: SessionMenuProps) => {
  const groups = useMemo<MenuGroup[]>(() => [{
    id: 'session',
    items: [
      { id: 'duplicate', label: 'Duplicate', icon: 'copy', disabled: busy, onSelect: () => onDuplicate(id) },
      { id: 'delete', label: 'Delete', icon: 'trash-2', tone: 'danger', disabled: busy, onSelect: () => onDelete(id) },
    ],
  }], [busy, id, onDelete, onDuplicate]);
  return <DropdownMenu trigger={{ label: `More actions for ${name}`, icon: 'ellipsis', iconOnly: true }} variant="ghost" size="sm" groups={groups} />;
};

export { SessionMenu };
