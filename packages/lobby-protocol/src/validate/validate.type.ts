/* @layer protocol @kind types */

type Schema = Record<string, unknown>;

type SchemaProblem = { path: string; message: string };

type Walk = (node: Schema, value: unknown, path: string) => SchemaProblem[];

export type { Schema, SchemaProblem, Walk };
