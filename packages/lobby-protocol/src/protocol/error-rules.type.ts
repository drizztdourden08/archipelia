/* @layer protocol @kind types */

type ErrorFatality = 'always' | 'never' | 'before-welcome';

type ErrorRule = { fatal: ErrorFatality; close: number | null };

export type { ErrorFatality, ErrorRule };
