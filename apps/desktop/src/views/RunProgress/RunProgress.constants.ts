/* @layer renderer-app @kind config */
import type { EngineStage } from '@archipelia/model';
import type { Band } from './RunProgress.type';

const FAILED_MIN_PERCENT = 4;

const LOG_TAIL = 40;

const CLOCK_SLACK_MS = 2000;

const LOG_EMPTY = 'The generator writes its log when it ends.';

const ERROR_LINE = /error|exception|traceback|failed/i;

const LINE_BREAK = '\n';

const STAGE_BANDS: Record<EngineStage, Band> = {
  rolling: { from: 0, to: 5 },
  worlds: { from: 5, to: 10 },
  items: { from: 10, to: 15 },
  rules: { from: 15, to: 25 },
  fill: { from: 25, to: 70 },
  balance: { from: 70, to: 80 },
  output: { from: 80, to: 92 },
  archive: { from: 92, to: 96 },
  done: { from: 96, to: 97 },
};

const STARTING = 98;

const STAGE_LINES: Record<EngineStage, string> = {
  rolling: 'Rolling the player files',
  worlds: 'Creating the multiworld',
  items: 'Creating the items',
  rules: 'Calculating the access rules',
  fill: 'Filling the multiworld',
  balance: 'Balancing progression',
  output: 'Writing the output files',
  archive: 'Packing the archive',
  done: 'Generation done',
};

const STEP_STAGES: { id: string; stages: EngineStage[]; label: (players: number) => string }[] = [
  { id: 'roll', stages: ['rolling'], label: (players) => `Rolling ${players} player file${players === 1 ? '' : 's'}` },
  { id: 'worlds', stages: ['worlds'], label: () => 'Creating the multiworld' },
  { id: 'rules', stages: ['items', 'rules'], label: () => 'Items and access rules' },
  { id: 'fill', stages: ['fill', 'balance'], label: () => 'Filling and balancing' },
  { id: 'output', stages: ['output', 'archive', 'done'], label: () => 'Writing output and spoiler' },
];

const GENERATE_LOG = 'generate.log';

export { CLOCK_SLACK_MS, ERROR_LINE, FAILED_MIN_PERCENT, GENERATE_LOG, LINE_BREAK, LOG_EMPTY, LOG_TAIL, STAGE_BANDS, STAGE_LINES, STARTING, STEP_STAGES };
