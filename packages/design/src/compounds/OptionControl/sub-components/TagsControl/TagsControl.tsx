/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import { useFieldControl } from '@drizztdourden08/tessera/primitives';
import { TagInput } from '@drizztdourden08/tessera/composites';
import type { TagValidator } from '@drizztdourden08/tessera/composites';
import type { OptionControlProps } from '../../OptionControl.type';
import { ANY_TAG, NO_SUGGESTIONS } from './TagsControl.constants';
import { stringList } from '../../behavior/string-list';
import { tagsValue } from '../../behavior/tags-value';

const TagsControl = ({ def, value, onChange, disabled }: OptionControlProps) => {
  const { id } = useFieldControl();
  const known = def.validKeys?.length ? def.validKeys : undefined;
  const validate = useMemo<TagValidator>(
    () => (known ? (raw) => known.includes(raw) || 'Not a name this option knows' : ANY_TAG),
    [known],
  );
  const selected = useMemo(() => stringList(value), [value]);
  const handleChange = useCallback((next: readonly string[]) => onChange(tagsValue(def.kind, next)), [def.kind, onChange]);
  return (
    <TagInput
      id={id}
      value={selected}
      onChange={handleChange}
      suggestions={known ?? NO_SUGGESTIONS}
      validate={validate}
      enforce={known !== undefined}
      placeholder={known ? 'Add a name' : 'Type and press Enter'}
      disabled={disabled}
    />
  );
};

export { TagsControl };
