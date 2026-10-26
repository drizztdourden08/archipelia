/* @layer renderer-app @kind config */
const SECTION_ORDER = ['Installed', 'Official', 'Community'] as const;

const HEADER = '[role="gridcell"][aria-expanded]';

const MAX_MOUNTED_CARDS = 60;

export { HEADER, MAX_MOUNTED_CARDS, SECTION_ORDER };
