/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';
import type { TermFact } from './option-layout.type';
import { FACT_LINE } from './term-facts.constants';

const normal = (text: string) => text.toLowerCase().replace(/[_\-\s]+/g, ' ').trim();

const namesOf = (def: OptionDef) => new Set((def.choices ?? []).flatMap((choice) => [normal(choice.value), normal(choice.label)]));

const factOf = (line: string, names: ReadonlySet<string>): TermFact | null => {
  const [, term, text] = FACT_LINE.exec(line) ?? [];
  return term !== undefined && text !== undefined && names.has(normal(term)) ? { term: term.trim(), text: text.trim() } : null;
};

const splitTermFacts = (def: OptionDef): { description: string; facts: TermFact[] } => {
  const names = def.kind === 'choice' ? namesOf(def) : new Set<string>();
  const lines = def.description.split('\n');
  const facts = lines.flatMap((line) => factOf(line, names) ?? []);
  const rest = lines.filter((line) => factOf(line, names) === null);
  return { description: rest.join('\n').trim(), facts };
};

export { splitTermFacts };
