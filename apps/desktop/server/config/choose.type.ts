/* @layer server @kind types */
type Choice<T> = { key: string; env: string | undefined; file: unknown; fallback: T; read: (key: string, value: unknown) => T };

export type { Choice };
