/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import type { SpoilerLevel } from '@archipelia/model';
import { Field, Select, Stack, Toggle } from '@drizztdourden08/tessera/primitives';
import type { GenerationFieldsProps } from './GenerationFields.type';
import { SPOILER_OPTIONS } from '../../ServerOptionsForm.constants';

const GenerationFields = ({ generator, onGenerator }: GenerationFieldsProps) => {
  const setSpoiler = useCallback((value: string) => onGenerator({ spoiler: Number(value) as SpoilerLevel }), [onGenerator]);
  const setRace = useCallback((race: boolean) => onGenerator({ race }), [onGenerator]);
  const setBalancing = useCallback((progressionBalancing: boolean) => onGenerator({ progressionBalancing }), [onGenerator]);
  return (
    <Stack gap="sm">
      <Field label="Spoiler" inline>
        <Select value={String(generator.spoiler)} options={SPOILER_OPTIONS} onChange={setSpoiler} />
      </Field>
      <Toggle label="Race mode" description="Hides the spoiler and the seed details from players." checked={generator.race} onChange={setRace} />
      <Toggle label="Progression balancing" description="Moves key items earlier for players who would wait." checked={generator.progressionBalancing} onChange={setBalancing} />
    </Stack>
  );
};

export { GenerationFields };
