/* @layer renderer-app @kind logic */
import { VERB } from './busy-text.constants';
import type { Busy } from './busy-text.type';

const busyText = (busy: Busy, title: string): string => `${VERB[busy]} ${title}...`;

export { busyText };
