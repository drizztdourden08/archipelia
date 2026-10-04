/* @layer renderer-app @kind component */
import { useCallback, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button, Flex, Select, TextInput } from '@drizztdourden08/tessera/primitives';
import type { CounterAddProps } from './CounterAdd.type';
import { countsOf } from '../../behavior/counts-of';
import { unusedKeys } from '../../behavior/unused-keys';

const CounterAdd = ({ def, value, onAdd, disabled = false }: CounterAddProps) => {
  const [draft, setDraft] = useState('');
  const options = useMemo(() => unusedKeys(def, value).map((key) => ({ value: key, label: key })), [def, value]);
  const handleDraft = useCallback((event: ChangeEvent<HTMLInputElement>) => setDraft(event.target.value), []);
  const handleAdd = useCallback(() => {
    onAdd(draft);
    setDraft('');
  }, [draft, onAdd]);

  if (def.validKeys?.length) {
    return <Select value="" options={options} onChange={onAdd} placeholder="Add a name" aria-label={`Add a name to ${def.displayName}`} searchable disabled={disabled || !options.length} />;
  }
  const blocked = !draft.trim() || draft.trim() in countsOf(value);
  return (
    <Flex gap="sm" align="center">
      <TextInput value={draft} onChange={handleDraft} placeholder="Name" aria-label={`New name for ${def.displayName}`} disabled={disabled} />
      <Button size="sm" variant="secondary" onClick={handleAdd} disabled={disabled || blocked}>Add</Button>
    </Flex>
  );
};

export { CounterAdd };
