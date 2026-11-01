/* @layer renderer-app @kind config */
const SEAT_TINTS = ['violet', 'blue', 'teal', 'green', 'amber', 'orange', 'rose', 'pink', 'cyan', 'lime'] as const;

const ART_RATIO = { min: 0.75, max: 1.34 } as const;

const ART_MIN_PIXELS = 32;

const INITIALS_LENGTH = 2;

const HASH_STEP = 31;

const NONE: readonly never[] = [];

export { ART_MIN_PIXELS, ART_RATIO, HASH_STEP, INITIALS_LENGTH, NONE, SEAT_TINTS };
