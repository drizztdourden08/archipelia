/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Stack, Text } from '@drizztdourden08/tessera/primitives';
import { addCount } from '../behavior/add-count';
import { counterEntries } from '../behavior/counter-entries';
import { removeCount } from '../behavior/remove-count';
import { setCount } from '../behavior/set-count';
import type { OptionControlProps } from '../OptionControl.type';
import { CounterAdd } from './CounterAdd';
import { CounterRow } from './CounterRow';

const CounterControl = ({ def, value, onChange, disabled }: OptionControlProps) => {
  const rows = counterEntries(value);
  const handleCount = useCallback((name: string, count: number) => onChange(setCount(value, name, count)), [value, onChange]);
  const handleRemove = useCallback((name: string) => onChange(removeCount(value, name)), [value, onChange]);
  const handleAdd = useCallback((name: string) => onChange(addCount(value, name)), [value, onChange]);
  return (
    <Stack gap="xs">
      {rows.length === 0 && <Text variant="caption">None</Text>}
      {rows.map(([name, count]) => (
        <CounterRow key={name} optionKey={def.key} name={name} count={count} onCount={handleCount} onRemove={handleRemove} disabled={disabled} />
      ))}
      <CounterAdd def={def} value={value} onAdd={handleAdd} disabled={disabled} />
    </Stack>
  );
};

export { CounterControl };
