/* @layer renderer-app @kind logic */
import type { GameSchema, InstalledGame } from '@archipelia/model';

const hasOptions = (schema: unknown): schema is GameSchema =>
  typeof schema === 'object' && schema !== null && 'options' in schema && Array.isArray(schema.options);

const schemaFor = (installed: InstalledGame[], game: string): GameSchema | undefined =>
  installed.find((entry) => entry.game === game && hasOptions(entry.schema))?.schema;

export { schemaFor };
