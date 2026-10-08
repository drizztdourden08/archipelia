/* @layer renderer-app @kind component */
import { useCallback, useState } from 'react';
import { FormRow } from '@drizztdourden08/tessera/composites';
import { Text } from '@drizztdourden08/tessera/primitives';
import type { OptionFieldRowProps } from './OptionFieldRow.type';
import { OptionControl } from '../OptionControl';
import './OptionFieldRow.css';

const OptionFieldRow = ({ def, value, hint, changed, problem, onChange, onReset, onProblem }: OptionFieldRowProps) => {
  const [jsonProblem, setJsonProblem] = useState<string | null>(null);
  const handleProblem = useCallback((next: string | null) => {
    setJsonProblem(next);
    onProblem?.(next);
  }, [onProblem]);
  const about = def.description.trim();
  return (
    <FormRow
      label={def.displayName}
      description={about || hint ? (
        <>
          {hint && <Text className="option-field-row__hint">{hint}</Text>}
          {about && <Text className="option-field-row__description">{about}</Text>}
        </>
      ) : undefined}
      changed={changed}
      advanced={def.visibility.length === 0}
      problem={problem ?? jsonProblem ?? undefined}
      onReset={onReset}
    >
      <OptionControl def={def} value={value} onChange={onChange} onProblem={handleProblem} />
    </FormRow>
  );
};

export { OptionFieldRow };
