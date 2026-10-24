/* @layer client-kit @kind types */
import type { OptionSchema } from './schema/option-schema.type';

type PlayerYamlInput = {
  game: string;
  slotName: string;
  options?: Readonly<Record<string, unknown>>;
  schema?: OptionSchema;
  description?: string;
  preRolled?: Readonly<Record<string, unknown>>;
  preRolledKey?: string;
  allowUnknown?: boolean;
  allowRoll?: boolean;
  withDefaults?: boolean;
};

export type { PlayerYamlInput };
