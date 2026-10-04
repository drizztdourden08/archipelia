/* @layer renderer-app @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import type { SettingsPatch } from '@drizztdourden08/brock-react';
import { Field, NumberInput } from '@drizztdourden08/tessera/primitives';
import hostingSections from '../screens/multiworld/hosting/hosting.settings';
import type { AppSettings, NumberSettingKey } from '../settings.type';
import { NUMBER_BOUNDS } from './number-bounds.constants';

const isNumberKey = (key: string): key is NumberSettingKey => Object.hasOwn(NUMBER_BOUNDS, key);

const rowOf = (key: string) => hostingSections.flatMap((section) => section.items ?? []).find((item) => item.key === key);

const renderSettingControl = (key: string, settings: AppSettings, onChange: SettingsPatch<AppSettings>): ReactNode | null => {
  const row = rowOf(key);
  if (!isNumberKey(key) || row === undefined) return null;
  const { min, max } = NUMBER_BOUNDS[key];
  const change = (value: number) => onChange({ [key]: value });
  const input = createElement(NumberInput, { min, max, title: row.hint, value: settings[key], onChange: change });
  return createElement(Field, { label: row.label, hint: row.description, children: input });
};

export { renderSettingControl };
