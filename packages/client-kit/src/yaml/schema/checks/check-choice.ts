/* @layer client-kit @kind logic */
import type { OptionCheck } from './check.type';
import { describeValue } from './describe-value';

const spelled = (value: unknown): string | null => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return null;
};

const checkChoice: OptionCheck = ({ key, choices = [], numeric }, value) => {
  const text = spelled(value);
  const match = text === null ? undefined : choices.find((choice) => choice.value === text);
  if (match === undefined) {
    const allowed = choices.map((choice) => choice.value).join(', ');
    return { ok: false, code: 'bad-choice', message: `${key}: ${describeValue(value)} is not one of: ${allowed}.` };
  }
  return { ok: true, value: numeric === true ? Number(match.value) : match.value };
};

export { checkChoice };
