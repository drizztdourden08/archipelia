/* @layer testing @kind types */
import type { JsonValue } from './scenario.type';

type MatchWalk = (expected: JsonValue, actual: unknown, path: string) => string | null;

export type { MatchWalk };
