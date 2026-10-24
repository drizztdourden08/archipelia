/* @layer renderer-app @kind logic */
import type { SettingsRowAction } from '@drizztdourden08/tessera/composites';
import { CHANGE_ACTION } from '../EngineSettings.constants';
import type { ChoicePlan } from '../EngineSettings.type';

const changeActions = (plan: ChoicePlan, busy: boolean, onApply: () => void): SettingsRowAction[] =>
  (plan.kind === 'none' ? [] : [{ ...CHANGE_ACTION[plan.kind], disabled: busy, onSelect: onApply }]);

export { changeActions };
