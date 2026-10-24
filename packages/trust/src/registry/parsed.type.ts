/* @layer core @kind types */

type Parsed<T> = { value: T } | { problem: string };

export type { Parsed };
