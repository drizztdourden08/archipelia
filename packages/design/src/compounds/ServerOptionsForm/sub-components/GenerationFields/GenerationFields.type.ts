/* @layer renderer-app @kind types */
import type { GeneratorSettings } from '@archipelia/model';

type GenerationFieldsProps = {
  generator: GeneratorSettings;
  onGenerator: (patch: Partial<GeneratorSettings>) => void;
};

export type { GenerationFieldsProps };
