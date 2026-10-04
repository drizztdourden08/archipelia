/* @layer electron-main @kind config */
import type { EngineStage, HostTarget, SessionStatus } from '@archipelia/model';
import type { RunEngineStep } from './run-jobs.type';

const ENGINE_STEPS: RunEngineStep[] = [
  { id: 'roll', stages: ['rolling'], weight: 1, label: (players) => `Rolling ${players} player file${players === 1 ? '' : 's'}` },
  { id: 'worlds', stages: ['worlds'], weight: 1, label: () => 'Creating the multiworld' },
  { id: 'rules', stages: ['items', 'rules'], weight: 2, label: () => 'Items and access rules' },
  { id: 'fill', stages: ['fill', 'balance'], weight: 6, label: () => 'Filling and balancing' },
  { id: 'output', stages: ['output', 'archive', 'done'], weight: 2, label: () => 'Writing output and spoiler' },
];

const HOST_STEP = 'host';

const HOST_LABELS: Record<HostTarget['kind'], string> = {
  'archipelago-gg': 'Uploading to archipelago.gg',
  remote: 'Starting the remote server',
  local: 'Starting the local server',
};

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

const HOSTING_LINE = 'The server is up';

const ENDED_LINE = 'The run is over';

const UNFINISHED: ReadonlySet<SessionStatus> = new Set(['generating', 'starting']);

const CLOSED_ERROR = 'The app closed before the run ended';

export { CLOSED_ERROR, ENDED_LINE, ENGINE_STEPS, HOST_LABELS, HOST_STEP, HOSTING_LINE, STAGE_LINES, UNFINISHED };
