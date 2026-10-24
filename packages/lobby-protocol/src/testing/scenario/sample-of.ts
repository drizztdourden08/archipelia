/* @layer testing @kind logic */
import type { JsonValue } from './scenario.type';
import { WILDCARDS } from './placeholder.constants';
import { SAMPLE_VALUES } from './sample-values';

const sampleOf = (name: string): JsonValue => {
  const wildcard = WILDCARDS[name];
  if (wildcard) return wildcard.sample;
  const sample = (SAMPLE_VALUES as Record<string, JsonValue>)[name];
  if (sample === undefined) throw new Error(`the placeholder $${name} has no sample value`);
  return sample;
};

export { sampleOf };
