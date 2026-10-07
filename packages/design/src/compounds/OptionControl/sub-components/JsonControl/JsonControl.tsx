/* @layer renderer-app @kind component */
import { useCallback, useEffect } from 'react';
import { CodeBlock } from '@drizztdourden08/tessera/composites';
import { useFieldControl } from '@drizztdourden08/tessera/primitives';
import type { OptionValue } from '@archipelia/model';
import type { OptionControlProps } from '../../OptionControl.type';
import { useJsonText } from '../../behavior/useJsonText';

const JsonControl = ({ def, value, onChange, onProblem, disabled }: OptionControlProps) => {
  const control = useFieldControl();
  const handleChange = useCallback((next: unknown) => onChange(next as OptionValue), [onChange]);
  const { text, edit, problem } = useJsonText(value, handleChange, def.kind === 'dict' ? 'object' : 'array');
  const message = problem?.message ?? null;
  useEffect(() => {
    onProblem?.(message);
  }, [message, onProblem]);
  useEffect(() => () => onProblem?.(null), [onProblem]);
  return (
    <CodeBlock
      editable
      language="json"
      value={text}
      onChange={edit}
      invalid={problem !== null}
      problemLine={problem?.line}
      disabled={disabled}
      id={control.id}
      aria-describedby={control.describedBy}
    />
  );
};

export { JsonControl };
