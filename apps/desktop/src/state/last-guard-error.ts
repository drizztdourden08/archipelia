/* @layer renderer-app @kind logic */
import type { KeyedGuard } from '@drizztdourden08/brock-react';

const lastGuardError = ({ state }: KeyedGuard): string | null => Object.values(state.errors).at(-1) ?? null;

export { lastGuardError };
