/* @layer core @kind logic */

const currentTarget = (): string => `${process.platform}-${process.arch}`;

export { currentTarget };
