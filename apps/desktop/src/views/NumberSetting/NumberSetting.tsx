/* @layer renderer-app @kind component */
import { Field, NumberInput } from '@drizztdourden08/tessera/primitives';
import type { NumberSettingProps } from './NumberSetting.type';
import { NUMBER_BOUNDS } from './NumberSetting.constants';
import { settingRow } from './behavior/setting-row';

const NumberSetting = ({ settingKey, settings, onChange }: NumberSettingProps) => {
  const row = settingRow(settingKey);
  const { min, max } = NUMBER_BOUNDS[settingKey];
  return (
    <Field label={row?.label ?? settingKey} hint={row?.description}>
      <NumberInput min={min} max={max} title={row?.hint} value={settings[settingKey]} onChange={(value: number) => onChange({ [settingKey]: value })} />
    </Field>
  );
};

export { NumberSetting };
