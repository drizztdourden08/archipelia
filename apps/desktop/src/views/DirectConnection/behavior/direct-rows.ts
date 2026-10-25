/* @layer renderer-app @kind logic */
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import { TEXT } from '../DirectConnection.constants';
import type { DirectConnectionProps } from '../DirectConnection.type';

const directRows = ({ direct, busy, onEnable, onDisable, onOptions }: DirectConnectionProps): SettingsSectionRow[] => {
  const allow: SettingsSectionRow = { id: 'allow', ...TEXT.allow, disabled: busy, input: { kind: 'toggle', value: direct !== undefined, onChange: (on) => (on ? onEnable() : onDisable()) } };
  if (!direct) return [allow];
  return [
    allow,
    { id: 'approval', ...TEXT.approval, disabled: busy, input: { kind: 'toggle', value: direct.admission === 'host-approval', onChange: (on) => onOptions({ admission: on ? 'host-approval' : 'open' }) } },
    { id: 'unlisted', ...TEXT.unlisted, disabled: busy, input: { kind: 'toggle', value: direct.allowUnlisted, onChange: (allowUnlisted) => onOptions({ allowUnlisted }) } },
  ];
};

export { directRows };
