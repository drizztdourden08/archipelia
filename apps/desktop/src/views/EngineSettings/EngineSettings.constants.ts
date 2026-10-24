/* @layer renderer-app @kind config */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';
import type { EngineState, SmokeResult, VersionTag } from '@archipelia/model';
import type { DatePreset, StatusTone, TagLook } from '@drizztdourden08/tessera/primitives';
import type { ChoicePlan, RowText, WhenForm } from './EngineSettings.type';

const STATE_VIEW: Record<EngineState | 'unknown', { label: string; tone: StatusTone }> = {
  ready: { label: 'Ready', tone: 'success' },
  building: { label: 'Setting up', tone: 'warning' },
  missing: { label: 'Not set up', tone: 'neutral' },
  failed: { label: 'Setup failed', tone: 'danger' },
  unknown: { label: 'Checking', tone: 'neutral' },
};

const REBUILD_CONFIRM: ConfirmActionOptions = {
  title: 'Rebuild the engine',
  message: 'The engine is removed and downloaded again, about 90 MB.',
  confirmLabel: 'Rebuild',
  variant: 'danger',
};

const FAILURE = {
  setup: 'The engine setup failed. Set up engine tries again.',
  open: 'Could not open the engine folder.',
  overview: 'Could not read the engine versions.',
  apply: 'The engine change failed.',
  remove: 'Could not remove the engine.',
} as const;

const STARTING_STEP = 'Starting';

const SECTION_TEXT = {
  intro: 'The engine is a private Python with the Archipelago source you choose. It generates seeds and runs the servers, out of sight. A new engine installs beside the current one and takes over only after it passes a test.',
  versions: { title: 'Versions', description: 'Pick the Archipelago and Python the engine runs. Any version works, newer or older.' },
  installed: { title: 'Installed engines', description: 'Every engine kept on this computer. Sessions made with a removed engine are hosted with the one in use.' },
  status: { title: 'Status', description: 'The state of the engine in use.' },
} as const;

const ROW_TEXT = {
  archipelago: {
    label: 'Archipelago version',
    description: 'The Archipelago release the engine runs. Only stable releases are listed.',
    hint: 'Releases this app cannot read are not listed.',
    keywords: 'ap release upgrade downgrade newer older',
  },
  python: {
    label: 'Python version',
    description: 'The Python the engine runs on. The newest build of each line is listed.',
    hint: 'Archipelago checks that the two fit when you install.',
    keywords: 'python interpreter downgrade upgrade',
  },
  list: {
    label: 'Version list',
    description: 'The lists come from GitHub and are kept on this computer.',
    hint: 'Check now asks GitHub again.',
    keywords: 'check update refresh feed github',
  },
  change: {
    label: 'Change the engine',
    description: 'The chosen versions install beside the engine in use and are tested before they take over. A failed install never touches the engine in use.',
    hint: 'The engine in use is the one marked Active below.',
    keywords: 'install switch upgrade',
  },
} as const satisfies Record<string, RowText>;

const CHANGE_HINT: Record<ChoicePlan['kind'], string> = {
  none: 'The engine in use already matches your choice.',
  switch: 'This pair is already installed. Switching is instant.',
  install: 'This downloads about 90 MB and needs the network.',
};

const CHANGE_ACTION = {
  install: { id: 'install', label: 'Install and switch' },
  switch: { id: 'switch', label: 'Switch' },
} as const;

const CHECK_ACTION = { id: 'check-now', label: 'Check now' } as const;

const NO_PLAN: ChoicePlan = { kind: 'none' };

const TAG_VIEW: Record<VersionTag, { label: string; look: TagLook }> = {
  'new-version': { label: 'New version', look: { variant: 'urgency', color: 'info' } },
  'up-to-date': { label: 'Up to date', look: { variant: 'urgency', color: 'success' } },
  'not-checked': { label: 'Not checked', look: { variant: 'normal', color: 'neutral' } },
};

const ACTIVE_LOOK: TagLook = { variant: 'urgency', color: 'success' };

const FAILED_LOOK: TagLook = { variant: 'urgency', color: 'danger' };

const FAILED_CHECK: Record<NonNullable<SmokeResult['failed']>, string> = {
  schema: 'The options check failed.',
  generate: 'Making a test seed failed.',
  host: 'Starting the test server failed.',
};

const FAILED_UNKNOWN = 'The install did not finish.';

const LIST_TEXT = {
  label: 'Installed engines',
  empty: 'No engine is installed yet. Pick versions above and install.',
  switchLabel: 'Switch',
  removeLabel: 'Remove',
} as const;

const WHEN_FORMAT: Record<WhenForm, DatePreset> = { ago: 'relative', day: 'date', time: 'time' };

const KEPT_AFTER_REMOVE = 'Sessions made with it are hosted with the engine in use.';

export {
  ACTIVE_LOOK, CHANGE_ACTION, CHANGE_HINT, CHECK_ACTION, FAILED_CHECK, FAILED_LOOK, FAILED_UNKNOWN, FAILURE, KEPT_AFTER_REMOVE, LIST_TEXT,
  NO_PLAN, REBUILD_CONFIRM, ROW_TEXT, SECTION_TEXT, STARTING_STEP, STATE_VIEW, TAG_VIEW, WHEN_FORMAT,
};
