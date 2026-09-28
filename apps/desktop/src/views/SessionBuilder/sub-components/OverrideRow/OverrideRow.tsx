/* @layer renderer-app @kind component */
import { memo, useCallback, useMemo } from 'react';
import type { OptionValue } from '@archipelia/model';
import type { OverrideRowProps } from './OverrideRow.type';
import { OptionFieldRow, hintOf } from '../../../../option-fields';

const OverrideRowView = ({ def, value, presetValue, overridden, problem, onValue, onReset }: OverrideRowProps) => {
  const handleChange = useCallback((next: OptionValue) => onValue(def.key, next, presetValue), [def.key, onValue, presetValue]);
  const handleReset = useCallback(() => onReset(def.key), [def.key, onReset]);
  const hint = useMemo(() => hintOf(def, presetValue, 'preset') ?? 'Preset value kept unless changed here.', [def, presetValue]);
  return (
    <OptionFieldRow
      def={def}
      value={value}
      hint={hint}
      changed={overridden}
      problem={problem}
      onChange={handleChange}
      onReset={handleReset}
    />
  );
};

const OverrideRow = memo(OverrideRowView);

export { OverrideRow };
