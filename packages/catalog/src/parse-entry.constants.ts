/* @layer core @kind config */
import type { Stability } from '@archipelia/model';

const STABILITY = new Set<Stability>(['stable', 'unstable', 'alpha', 'beta', 'untested']);

export { STABILITY };
