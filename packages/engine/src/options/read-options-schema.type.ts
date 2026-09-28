/* @layer core @kind types */
import type { GameSchema } from '@archipelia/model';

type DumpedSchema = GameSchema & { unsupported: string[] };

type SchemaDump = { schemas: Record<string, DumpedSchema>; errors: Record<string, string>; failedWorlds: string[]; seconds: number };

type SchemaRead = SchemaDump & { lines: string[] };

export type { DumpedSchema, SchemaDump, SchemaRead };
