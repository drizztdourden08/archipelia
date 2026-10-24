/* @layer core @kind logic */
const readWhole = (name: string, value: unknown, range: { min: number; max: number }): number => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < range.min || value > range.max) {
    throw new Error(`${name} must be a whole number from ${range.min} to ${range.max}`);
  }
  return value;
};

export { readWhole };
