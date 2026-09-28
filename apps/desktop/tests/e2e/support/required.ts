/* @layer tests @kind helper */
const required = <T>(value: T | undefined, what: string): T => {
  if (value === undefined) throw new Error(`${what} is missing`);
  return value;
};

export { required };
