/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import { TagInput } from '@drizztdourden08/tessera/primitives';
import type { TagValidator } from '@drizztdourden08/tessera/primitives';
import type { OptionControlProps } from '../../OptionControl.type';
import { ANY_TAG, NO_SUGGESTIONS } from './TagsControl.constants';
import { stringList } from '../../../values/string-list';
import { tagsValue } from '../../../values/tags-value';

const TagsControl = ({ def, value, onChange, disabled }: OptionControlProps) => {
  const known = def.validKeys?.length ? def.validKeys : undefined;
  const validate = useMemo<TagValidator>(
    () => (known ? (raw) => known.includes(raw) || 'Not a name this option knows' : ANY_TAG),
    [known],
  );
  const selected = useMemo(() => stringList(value), [value]);
  const handleChange = useCallback((next: readonly string[]) => onChange(tagsValue(def.kind, next)), [def.kind, onChange]);
  return (
    <TagInput
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
