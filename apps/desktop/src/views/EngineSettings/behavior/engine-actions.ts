/* @layer renderer-app @kind logic */
import type { SettingAction } from '@drizztdourden08/brock-react';
import { REBUILD_CONFIRM } from '../EngineSettings.constants';
import type { EngineActionsInput } from '../EngineSettings.type';

const engineActions = ({ ready, building, setup, refresh, showProgress }: EngineActionsInput): SettingAction[] => [
  ...(ready ? [] : [{ id: 'setup', label: 'Set up engine', icon: 'download', variant: 'primary', disabled: building, onSelect: setup } satisfies SettingAction]),
  { id: 'check', label: 'Check again', icon: 'refresh-cw', variant: ready ? 'primary' : 'secondary', disabled: building, onSelect: refresh },
  ...(ready ? [{ id: 'rebuild', label: 'Rebuild engine', icon: 'rotate-ccw', variant: 'danger', confirm: REBUILD_CONFIRM, onSelect: setup } satisfies SettingAction] : []),
  ...(showProgress ? [{ id: 'progress', label: building ? 'Show progress' : 'Show the last set up', icon: 'list', onSelect: showProgress } satisfies SettingAction] : []),
];

export { engineActions };
