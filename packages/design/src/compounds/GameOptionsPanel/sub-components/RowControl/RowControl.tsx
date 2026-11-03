/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { Box, SegmentedControl, Text } from '@drizztdourden08/tessera/primitives';
import { ValueTag } from '@drizztdourden08/tessera/composites';
import type { RowControlProps } from './RowControl.type';
import { OptionControl, choiceOptions } from '../../../OptionControl';
import { readOnlyValue } from '../../behavior/read-only-value';

const RowControl = ({ row, id, readOnly, problem, onChange, onProblem }: RowControlProps) => {
  const segments = useMemo(() => (row.control === 'segmented' ? choiceOptions(row.def) : []), [row.control, row.def]);
  return (
    <Box id={id} role="group" aria-label={row.label} className="game-option-row__control">
      {readOnly && <ValueTag value={readOnlyValue(row.def, row.value)} />}
      {!readOnly && row.control === 'segmented' && (
        <SegmentedControl
          size="sm"
          aria-label={row.label}
          value={String(row.value)}
          options={segments}
          onChange={onChange}
        />
      )}
      {!readOnly && row.control !== 'segmented' && <OptionControl def={row.def} value={row.value} onChange={onChange} onProblem={onProblem} />}
      {problem && <Text variant="caption" tone="danger" role="alert">{problem}</Text>}
    </Box>
  );
};

export { RowControl };
