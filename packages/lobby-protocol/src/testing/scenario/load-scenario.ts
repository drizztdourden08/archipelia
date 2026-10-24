/* @layer testing @kind logic */
import { readFileSync } from 'node:fs';
import type { Scenario } from './scenario.type';
import { findFixturesDir } from './find-fixtures-dir';
import { parseFixture } from './parse-fixture';
import { SCENARIO_CATALOG } from './scenario-catalog';

const loadScenario = (name: string): Scenario => {
  const entry = SCENARIO_CATALOG.find((candidate) => candidate.name === name);
  if (!entry) throw new Error(`there is no scenario named ${name}`);
  const text = readFileSync(new URL(`${name}.jsonl`, findFixturesDir()), 'utf8');
  return { ...entry, lines: parseFixture(text, name) };
};

export { loadScenario };
