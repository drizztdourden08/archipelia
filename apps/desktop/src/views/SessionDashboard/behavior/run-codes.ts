/* @layer renderer-app @kind logic */
import type { LobbyStageCode } from '@archipelia/design';
import { RUN_STAGE_TEXT } from './run-stage.constants';

const runCodes = (address: string | null, seed: string | undefined): LobbyStageCode[] => [
  ...(address ? [{ label: RUN_STAGE_TEXT.address, value: address }] : []),
  ...(seed ? [{ label: RUN_STAGE_TEXT.seed, value: seed, copyLabel: RUN_STAGE_TEXT.copySeed }] : []),
];

export { runCodes };
