/* @layer core @kind config */
import type { LobbyPhase } from '@archipelia/model';

const STARTABLE_PHASES: LobbyPhase[] = ['open', 'locked', 'failed'];

const OUTPUT_SLOT = /_P(\d+)_(.+)$/;
const SKIPPED_OUTPUT = /\.archipelago$|_Spoiler\.txt$/;

const PASSWORD_BYTES = 9;

const ENGINE_STAGES = ['rolling', 'worlds', 'items', 'rules', 'fill', 'balance', 'output', 'archive', 'done'];

const GENERATE_SHARE = 0.8;

const GENERATE_TIMEOUT_MS = 60 * 60 * 1000;

const GENERATE_DISK_BYTES = 2 * 1024 * 1024 * 1024;
const HOSTING_FRACTION = 0.9;

export { ENGINE_STAGES, GENERATE_DISK_BYTES, GENERATE_SHARE, GENERATE_TIMEOUT_MS, HOSTING_FRACTION, OUTPUT_SLOT, PASSWORD_BYTES, SKIPPED_OUTPUT, STARTABLE_PHASES };
