/* @layer renderer-app @kind logic */
import type { Loose } from './coerce-option-value.type';

const isLoose = (raw: unknown): raw is Loose => typeof raw === 'object' && raw !== null && !Array.isArray(raw);

export { isLoose };
