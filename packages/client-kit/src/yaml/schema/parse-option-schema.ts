/* @layer client-kit @kind logic */
import type { OptionRow, OptionSchema } from './option-schema.type';
import { createKitError } from '../../errors/create-kit-error';
import { parseOptionRow } from './parse-option-row';

const parseOptionSchema = (source: unknown): OptionSchema => {
  const raw: unknown = typeof source === 'string' ? safeJson(source) : source;
  if (!Array.isArray(raw)) throw createKitError('invalid-schema', 'The option schema must be a list of option rows (the options.json of the world).');
  const problems: string[] = [];
  const rows: OptionRow[] = [];
  const seen = new Set<string>();
  raw.forEach((candidate: unknown, index: number) => {
    const parsed = parseOptionRow(candidate, index);
    problems.push(...parsed.problems);
    if (parsed.row === null) return;
    if (seen.has(parsed.row.key)) problems.push(`${parsed.row.key}: listed twice.`);
    seen.add(parsed.row.key);
    rows.push(parsed.row);
  });
  if (problems.length > 0) throw createKitError('invalid-schema', ['The option schema is not valid:', ...problems.map((line) => `- ${line}`)].join('\n'));
  return rows;
};

const safeJson = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    throw createKitError('invalid-schema', 'The option schema text is not JSON.');
  }
};

export { parseOptionSchema };
