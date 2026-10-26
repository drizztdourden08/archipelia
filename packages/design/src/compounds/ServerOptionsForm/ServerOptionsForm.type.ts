/* @layer renderer-app @kind types */
import type { GeneratorSettings, ServerSettings } from '@archipelia/model';

type RowText = { label: string; description: string; hint: string; keywords?: string };

type ServerOptionsFormProps = {
  generator: GeneratorSettings;
  server: ServerSettings;
  onGenerator: (patch: Partial<GeneratorSettings>) => void;
  onServer: (patch: Partial<ServerSettings>) => void;
};

export type { RowText, ServerOptionsFormProps };
