/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import { Button, Flex, Text } from '@drizztdourden08/tessera/primitives';
import type { CounterRowProps } from './CounterRow.type';
import { numberDescriptor } from '../../behavior/number-descriptor';
import { numberValue } from '../../behavior/number-value';
import { KitEditor } from '../KitEditor';
import { COUNT_BOUNDS } from './CounterRow.constants';

const CounterRow = ({ optionKey, name, count, onCount, onRemove, disabled }: CounterRowProps) => {
  const field = useMemo(() => numberDescriptor(`${optionKey}.${name}`, name), [optionKey, name]);
  const handleCount = useCallback((raw: unknown) => {
    const next = numberValue(raw);
    if (next !== undefined) onCount(name, next);
  }, [name, onCount]);
  const handleRemove = useCallback(() => onRemove(name), [name, onRemove]);
  return (
    <Flex className="option-control__counter-row" gap="sm" align="center">
      <Text className="option-control__counter-name">{name}</Text>
      <KitEditor field={field} value={count} onChange={handleCount} bounds={COUNT_BOUNDS} disabled={disabled} />
      <Button size="sm" variant="tertiary" onClick={handleRemove} disabled={disabled}>Remove</Button>
    </Flex>
  );
};

export { CounterRow };
