/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import { Box, Flex, Slider } from '@drizztdourden08/tessera/primitives';
import { optionDescriptor } from '../behavior/option-descriptor';
import { numberValue } from '../behavior/number-value';
import type { OptionControlProps } from '../OptionControl.type';
import { KitEditor } from './KitEditor';

const RangeControl = ({ def, value, onChange, disabled }: OptionControlProps) => {
  const field = useMemo(() => optionDescriptor(def), [def]);
  const bounds = useMemo(() => ({ min: def.range?.min, max: def.range?.max, step: 1 }), [def.range]);
  const handleChange = useCallback((raw: unknown) => {
    const next = numberValue(raw);
    if (next !== undefined) onChange(next);
  }, [onChange]);
  const current = typeof value === 'number' ? value : (def.range?.min ?? 0);
  return (
    <Flex className="option-control__range" gap="sm" align="center">
      {def.range && (
        <Box className="option-control__slider">
          <Slider value={current} min={def.range.min} max={def.range.max} onChange={handleChange} disabled={disabled} showValue={false} />
        </Box>
      )}
      <KitEditor field={field} value={value} onChange={handleChange} disabled={disabled} bounds={bounds} />
    </Flex>
  );
};

export { RangeControl };
