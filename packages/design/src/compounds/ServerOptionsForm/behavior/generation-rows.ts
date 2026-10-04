/* @layer renderer-app @kind logic */
import type { SettingsItem } from '@drizztdourden08/tessera/composites';
import type { GeneratorSettings, SpoilerLevel } from '@archipelia/model';
import type { ServerOptionsFormProps } from '../ServerOptionsForm.type';
import { GENERATION_TEXT, SPOILER_OPTIONS } from '../ServerOptionsForm.constants';
import { rowOf } from './row-of';

const generationRows = (generator: GeneratorSettings, onGenerator: ServerOptionsFormProps['onGenerator']): SettingsItem[] => [
  {
    ...rowOf('spoiler', GENERATION_TEXT.spoiler),
    input: { kind: 'select', value: String(generator.spoiler), options: SPOILER_OPTIONS, onChange: (value) => onGenerator({ spoiler: Number(value) as SpoilerLevel }) },
  },
  { ...rowOf('race', GENERATION_TEXT.race), input: { kind: 'toggle', value: generator.race, onChange: (race) => onGenerator({ race }) } },
  {
    ...rowOf('progressionBalancing', GENERATION_TEXT.progressionBalancing),
    input: { kind: 'toggle', value: generator.progressionBalancing, onChange: (progressionBalancing) => onGenerator({ progressionBalancing }) },
  },
];

export { generationRows };
