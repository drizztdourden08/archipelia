/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import { Box, TagPicker } from '@drizztdourden08/tessera/primitives';
import { stringList } from '../../behavior/string-list';
import { tagsValue } from '../../behavior/tags-value';
import type { OptionControlProps } from '../../OptionControl.type';

const SetPickerControl = ({ def, value, onChange, disabled, labelId }: OptionControlProps) => {
  const groups = useMemo(
    () => [{ id: def.key, options: (def.validKeys ?? []).map((key) => ({ value: key, label: key })) }],
    [def.key, def.validKeys],
  );
  const selected = useMemo(() => stringList(value), [value]);
  const handleChange = useCallback((next: string[]) => onChange(tagsValue(def.kind, next)), [def.kind, onChange]);
  return (
    <Box role="group" aria-labelledby={labelId} className="option-control__labelled">
      <TagPicker value={selected} groups={groups} onChange={handleChange} disabled={disabled} />
    </Box>
  );
};

export { SetPickerControl };
