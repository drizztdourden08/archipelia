/* @layer core @kind config */
const ADMISSIONS = ['open', 'host-approval'] as const;

const RELEASE_MODES = ['disabled', 'enabled', 'auto', 'auto-enabled', 'goal'] as const;

const REMAINING_MODES = ['disabled', 'enabled', 'goal'] as const;

const SPOILER_LEVELS = [0, 1, 2, 3] as const;

export { ADMISSIONS, RELEASE_MODES, REMAINING_MODES, SPOILER_LEVELS };
