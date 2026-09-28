/* @layer renderer-app @kind component */
import { memo, useCallback, useMemo } from 'react';
import type { OptionValue } from '@archipelia/model';
import type { OptionRowProps } from './OptionRow.type';
import { OptionFieldRow, hintOf, isChangedValue } from '../../../../option-fields';

const OptionRowView = ({ def, value, problem, onValue, onReset }: OptionRowProps) => {
  const handleChange = useCallback((next: OptionValue) => onValue(def.key, next), [def.key, onValue]);
  const handleReset = useCallback(() => onReset(def.key), [def.key, onReset]);
  const hint = useMemo(() => hintOf(def), [def]);
  return (
    <OptionFieldRow
      def={def}
      value={value}
      hint={hint}
      changed={isChangedValue(value, def.default)}
      problem={problem}
      onChange={handleChange}
      onReset={handleReset}
    />
  );
};

const OptionRow = memo(OptionRowView);

export { OptionRow };
