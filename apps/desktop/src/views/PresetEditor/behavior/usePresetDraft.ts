/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import type { GamePreset, GameSchema, OptionValue } from '@archipelia/model';
import { changedValues, checkValues, defaultValues, resolveValues } from '@archipelia/presets';
import type { OptionValues } from '@archipelia/presets';
import { sameValues } from './same-values';

const usePresetDraft = (preset: GamePreset, schema: GameSchema) => {
  const [name, setName] = useState(preset.name);
  const [values, setValues] = useState<OptionValues>(() => resolveValues(schema, preset.values));
  const defaults = useMemo(() => defaultValues(schema), [schema]);
  const saved = useMemo(() => changedValues(schema, preset.values), [schema, preset.values]);
  const changed = useMemo(() => changedValues(schema, values), [schema, values]);
  const problems = useMemo(() => checkValues(schema, values), [schema, values]);
  const dirty = name.trim() !== preset.name || !sameValues(changed, saved);

  const setValue = useCallback((key: string, value: OptionValue) => setValues((prev) => ({ ...prev, [key]: value })), []);
  const resetValue = useCallback((key: string) => {
    const value = defaults[key];
    if (value !== undefined) setValue(key, value);
  }, [defaults, setValue]);
  const resetAll = useCallback(() => setValues(defaults), [defaults]);
  const replaceValues = useCallback((next: OptionValues) => setValues(resolveValues(schema, next)), [schema]);
  const revert = useCallback(() => {
    setName(preset.name);
    setValues(resolveValues(schema, preset.values));
  }, [preset.name, preset.values, schema]);

  return { changed, defaults, dirty, name, problems, replaceValues, resetAll, resetValue, revert, setName, setValue, values };
};

export { usePresetDraft };
