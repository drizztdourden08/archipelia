/* @layer renderer-app @kind logic */
import type { GeneratorSettings, ServerSettings } from '@archipelia/model';
import { RELEASE_OPTIONS, percentText } from '@archipelia/design';

const modeLabel = (mode: string): string => (RELEASE_OPTIONS.find((option) => option.value === mode)?.label ?? mode).toLowerCase();

const worldSummary = (generator: GeneratorSettings, server: ServerSettings): string => [
  `Hint cost ${percentText(server.hintCost)}`,
  `release ${modeLabel(server.releaseMode)}`,
  `collect ${modeLabel(server.collectMode)}`,
  `race ${generator.race ? 'on' : 'off'}`,
].join(', ');

export { worldSummary };
