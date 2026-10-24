/* @layer core @kind types */
import type { Registry } from './registry.type';

type RegistryParse = { ok: true; registry: Registry; problems: string[] } | { ok: false; problems: string[] };

export type { RegistryParse };
