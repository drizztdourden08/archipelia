/* @layer core @kind logic */
const readChoice = <T extends string | number>(name: string, value: unknown, choices: readonly T[]): T => {
  const found = choices.find((choice) => choice === value);
  if (found === undefined) throw new Error(`${name} must be one of ${choices.join(', ')}`);
  return found;
};

export { readChoice };
