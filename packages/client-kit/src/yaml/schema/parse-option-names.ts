/* @layer client-kit @kind logic */

const isName = (candidate: unknown): candidate is string => typeof candidate === 'string' && candidate !== '';

const parseOptionNames = (label: string, raw: unknown, problems: string[]): readonly string[] | undefined => {
  if (!Array.isArray(raw) || raw.length === 0 || !raw.every(isName)) {
    problems.push(`${label}: a set or list needs a non-empty "names" list of texts.`);
    return undefined;
  }
  if (new Set(raw).size !== raw.length) {
    problems.push(`${label}: "names" lists a name twice.`);
    return undefined;
  }
  return [...raw];
};

export { parseOptionNames };
