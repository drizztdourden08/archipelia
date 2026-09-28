/* @layer renderer-app @kind logic */
import type { GameSchema } from '@archipelia/model';
import type { StartOption } from '../PresetsHub.type';
import { DEFAULTS } from '../PresetsHub.constants';

const startFromOptions = (schema: GameSchema | undefined): StartOption[] => [
  { value: DEFAULTS, label: 'Game defaults' },
  ...Object.keys(schema?.presets ?? {}).map((name) => ({ value: name, label: `Start from: ${name}` })),
];

export { startFromOptions };
