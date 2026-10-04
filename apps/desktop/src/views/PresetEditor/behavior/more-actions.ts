/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera/composites';
import type { MoreActions } from '../PresetEditor.type';

const moreActions = ({ busy, onDuplicate, onImport, onExport, onResetAll, onDelete }: MoreActions): MenuGroup[] => [
  {
    id: 'preset',
    items: [
      { id: 'duplicate', label: 'Duplicate', icon: 'copy', disabled: busy, onSelect: onDuplicate },
      { id: 'import', label: 'Import YAML', icon: 'upload', disabled: busy, onSelect: onImport },
      { id: 'export', label: 'Export YAML', icon: 'download', disabled: busy, onSelect: onExport },
    ],
  },
  {
    id: 'reset',
    items: [
      { id: 'reset', label: 'Reset all to defaults', icon: 'rotate-ccw', disabled: busy, onSelect: onResetAll },
      { id: 'delete', label: 'Delete', icon: 'trash-2', disabled: busy, onSelect: onDelete },
    ],
  },
];

export { moreActions };
