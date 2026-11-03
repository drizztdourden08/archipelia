/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';
import type { TermFact } from './option-layout.type';

const FACT_LINE = /^\s*(\w[\w -]{0,39}?)\s*:\s+(\S.*)$/;

const normal = (text: string) => text.toLowerCase().replace(/[_\-\s]+/g, ' ').trim();

const namesOf = (def: OptionDef) => new Set((def.choices ?? []).flatMap((choice) => [normal(choice.value), normal(choice.label)]));

const factOf = (line: string, names: ReadonlySet<string>): TermFact | null => {
  const found = FACT_LINE.exec(line);
  return found && names.has(normal(found[1])) ? { term: found[1].trim(), text: found[2].trim() } : null;
};

const splitTermFacts = (def: OptionDef): { description: string; facts: TermFact[] } => {
  const names = def.kind === 'choice' ? namesOf(def) : new Set<string>();
  const lines = def.description.split('\n');
  const facts = lines.flatMap((line) => factOf(line, names) ?? []);
  const rest = lines.filter((line) => factOf(line, names) === null);
  return { description: rest.join('\n').trim(), facts };
};

export { splitTermFacts };
