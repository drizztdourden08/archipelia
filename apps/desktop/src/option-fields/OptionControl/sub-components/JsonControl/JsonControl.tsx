/* @layer renderer-app @kind component */
import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Stack, Text, Textarea } from '@drizztdourden08/tessera/primitives';
import type { OptionControlProps } from '../../OptionControl.type';
import { formatJson } from '../../../values/format-json';
import { parseJson } from '../../../values/parse-json';
import { sameJson } from '../../../values/same-json';
import { MAX_ROWS } from './JsonControl.constants';

const JsonControl = ({ def, value, onChange, disabled }: OptionControlProps) => {
  const shape = def.kind === 'dict' ? 'object' : 'list';
  const [draft, setDraft] = useState(() => formatJson(value));
  const [error, setError] = useState<string | null>(null);
  const external = JSON.stringify(value);

  useEffect(() => {
    if (!sameJson(draft, value, shape)) {
      setDraft(formatJson(value));
      setError(null);
    }
  }, [external]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setDraft(text);
    const parsed = parseJson(text, shape);
    setError(parsed.error ?? null);
    if (parsed.value !== undefined) onChange(parsed.value);
  };

  return (
    <Stack gap="xs">
      <Textarea
        className="option-control__json"
        value={draft}
        onChange={handleChange}
        disabled={disabled}
        spellCheck={false}
        rows={Math.min(MAX_ROWS, draft.split('\n').length + 1)}
      />
      {error && <Text variant="caption" role="alert">{error}</Text>}
    </Stack>
  );
};

export { JsonControl };
