/* @layer renderer-app @kind config */
import type { SessionStatus, SpoilerLevel } from '@archipelia/model';

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const LIVE: SessionStatus[] = ['generating', 'starting', 'hosting'];

const SPOILER_LABEL: Record<SpoilerLevel, string> = { 0: 'no spoiler', 1: 'spoiler basic', 2: 'spoiler playthrough', 3: 'spoiler full' };

export { DATE_FORMAT, LIVE, SPOILER_LABEL };
