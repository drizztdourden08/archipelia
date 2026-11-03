/* @layer renderer-app @kind component */
import { useCallback, useState } from 'react';
import type { OptionValue } from '@archipelia/model';
import { OptionRow } from '@drizztdourden08/tessera/composites';
import type { GameOptionRowProps } from './GameOptionRow.type';
import { optionDomId } from '../../behavior/option-dom-id';
import { RowAbout } from '../RowAbout';
import { RowControl } from '../RowControl';

const GameOptionRow = ({ row, readOnly, problem, onChange, onProblem }: GameOptionRowProps) => {
  const [jsonProblem, setJsonProblem] = useState<string | null>(null);
  const editable = !readOnly && onChange !== undefined;
  const handleChange = useCallback((next: OptionValue) => onChange?.(row.key, next), [onChange, row.key]);
  const handleReset = useCallback(() => onChange?.(row.key, row.defaultValue), [onChange, row.key, row.defaultValue]);
  const handleProblem = useCallback((next: string | null) => {
    setJsonProblem(next);
    onProblem?.(row.key, next);
  }, [onProblem, row.key]);
  return (
    <OptionRow
      label={row.label}
      description={<RowAbout row={row} />}
      changed={row.changed}
      onReset={editable ? handleReset : undefined}
      control={(
        <RowControl
          row={row}
          id={optionDomId(row.key)}
          readOnly={!editable}
          problem={problem ?? jsonProblem ?? undefined}
          onChange={handleChange}
          onProblem={handleProblem}
        />
      )}
    />
  );
};

export { GameOptionRow };
