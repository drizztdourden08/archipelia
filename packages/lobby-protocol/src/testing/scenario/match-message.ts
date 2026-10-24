/* @layer testing @kind logic */
import type { Bindings, JsonValue } from './scenario.type';
import type { MatchWalk } from './match-message.type';
import { isRecord } from '../../validate/is-record';
import { isHasClause } from './is-has-clause';
import { WILDCARDS } from './placeholder.constants';
import { placeholderName } from './placeholder-name';

const show = (value: unknown): string => String(JSON.stringify(value));

const matchPlaceholder = (name: string, actual: unknown, bindings: Bindings, path: string): string | null => {
  const wildcard = WILDCARDS[name];
  if (wildcard) return wildcard.accepts(actual) ? null : `${path}: ${show(actual)} does not fit $${name}`;
  const bound = bindings[name];
  if (bound === undefined) {
    if (actual === undefined) return `${path}: expected a value for $${name}`;
    bindings[name] = actual as JsonValue;
    return null;
  }
  const same = JSON.stringify(bound) === JSON.stringify(actual);
  return same ? null : `${path}: expected ${show(bound)} ($${name}), got ${show(actual)}`;
};

const matchArray = (expected: JsonValue[], actual: unknown, path: string, walk: MatchWalk): string | null => {
  if (!Array.isArray(actual) || actual.length !== expected.length) {
    return `${path}: expected a list of ${expected.length}, got ${show(actual)}`;
  }
  for (const [index, entry] of expected.entries()) {
    const problem = walk(entry, actual[index], `${path}[${index}]`);
    if (problem) return problem;
  }
  return null;
};

const matchObject = (
  expected: Record<string, JsonValue>,
  actual: unknown,
  path: string,
  walk: MatchWalk,
): string | null => {
  if (!isRecord(actual)) return `${path}: expected an object, got ${show(actual)}`;
  for (const [key, entry] of Object.entries(expected)) {
    const problem = walk(entry, actual[key], path === '' ? key : `${path}.${key}`);
    if (problem) return problem;
  }
  return null;
};

const matchMessage = (expected: JsonValue, actual: unknown, bindings: Bindings): string | null => {
  const matchHas = (wants: { $has: JsonValue }[], got: unknown, path: string): string | null => {
    if (!Array.isArray(got)) return `${path}: expected a list, got ${show(got)}`;
    for (const want of wants) {
      const entry: unknown = got.find((candidate) => matchMessage(want.$has, candidate, { ...bindings }) === null);
      if (entry === undefined) return `${path}: no entry matches ${show(want.$has)}`;
      matchMessage(want.$has, entry, bindings);
    }
    return null;
  };

  const walk: MatchWalk = (want, got, path) => {
    const name = placeholderName(want);
    if (name !== null) return matchPlaceholder(name, got, bindings, path);
    if (Array.isArray(want)) {
      const wrappers = want.filter(isHasClause);
      return want.length > 0 && wrappers.length === want.length ? matchHas(wrappers, got, path) : matchArray(want, got, path, walk);
    }
    if (typeof want === 'object' && want !== null) return matchObject(want, got, path, walk);
    return want === got ? null : `${path}: expected ${show(want)}, got ${show(got)}`;
  };
  return walk(expected, actual, '');
};

export { matchMessage };
