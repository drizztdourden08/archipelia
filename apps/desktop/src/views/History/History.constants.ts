/* @layer renderer-app @kind config */
import type { PlayerOrigin, SessionStatus, SpoilerLevel } from '@archipelia/model';
import type { RangeFilter, StatusFilter } from '../../stores/history-filter-store.type';

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const DAY_MS = 24 * 60 * 60 * 1000;

const CLEAN_DAYS = 30;

const LIVE = new Set<SessionStatus>(['generating', 'starting', 'hosting']);

const LIST_WIDTH = { initial: 380, min: 300, max: 560 } as const;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'hosting', label: 'Hosting' },
  { value: 'stopped', label: 'Stopped' },
  { value: 'failed', label: 'Failed' },
];

const STATUS_GROUP: Record<StatusFilter, readonly SessionStatus[]> = {
  all: [],
  hosting: ['generating', 'starting', 'hosting'],
  stopped: ['stopped'],
  failed: ['failed'],
};

const RANGE_OPTIONS: { value: RangeFilter; label: string }[] = [
  { value: 'all', label: 'Any date' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
];

const ORIGIN_LABEL: Record<PlayerOrigin, string> = { saved: 'Saved', added: 'Added in lobby', joined: 'Joined' };

const TRUST_LABEL = { verified: 'Verified', unlisted: 'Unlisted' } as const;

const SPOILER_LABEL: Record<SpoilerLevel, string> = { 0: 'None', 1: 'Basic', 2: 'Playthrough', 3: 'Full' };

const TEXT = {
  runAgainSoon: 'Coming with session tabs',
  sessionDeleted: 'Session deleted',
  byName: 'Source matched by name',
  noRun: 'Pick a run to see where it came from, who played and what it made.',
  noMatch: 'No run matches',
  noRuns: 'No run yet. Run a session to start one.',
  noChanges: 'Ran as saved. No setting was changed for this run.',
  noPlayers: 'No player was recorded for this run.',
} as const;

const FAILURE = {
  load: 'Could not load your runs.',
  deleteRun: 'Could not delete the run.',
  clean: 'Could not remove the old runs.',
} as const;

export {
  CLEAN_DAYS, DATE_FORMAT, DAY_MS, FAILURE, LIST_WIDTH, LIVE, ORIGIN_LABEL, RANGE_OPTIONS, SPOILER_LABEL, STATUS_GROUP, STATUS_OPTIONS, TEXT, TRUST_LABEL,
};
