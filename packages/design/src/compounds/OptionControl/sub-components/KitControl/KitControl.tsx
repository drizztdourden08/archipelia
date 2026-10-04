/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import { optionDescriptor } from '../../behavior/option-descriptor';
import { textValue } from '../../behavior/text-value';
import { toggleValue } from '../../behavior/toggle-value';
import type { OptionControlProps } from '../../OptionControl.type';
import { KitEditor } from '../KitEditor';

const KitControl = ({ def, value, onChange, disabled, labelId }: OptionControlProps) => {
  const field = useMemo(() => optionDescriptor(def), [def]);
  const handleChange = useCallback(
    (raw: unknown) => onChange(def.kind === 'toggle' ? toggleValue(raw) : textValue(raw)),
    [def.kind, onChange],
  );
  return <KitEditor field={field} value={value} onChange={handleChange} disabled={disabled} labelId={labelId} />;
};

export { KitControl };
