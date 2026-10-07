/* @layer renderer-app @kind logic */
const withProblem = (keys: readonly string[], key: string, problem: string | null): readonly string[] => {
  if (problem === null) return keys.includes(key) ? keys.filter((held) => held !== key) : keys;
  return keys.includes(key) ? keys : [...keys, key];
};

export { withProblem };
