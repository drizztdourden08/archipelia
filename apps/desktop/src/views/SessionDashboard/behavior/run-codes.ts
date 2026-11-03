/* @layer renderer-app @kind logic */
import type { LobbyStageCode } from '@archipelia/design';
import { hostLabel } from '@archipelia/model';
import type { Session } from '@archipelia/model';
import { networkCodes } from '../../../stage';
import { addressOf } from './address-of';
import { RUN_STAGE_TEXT } from './run-stage.constants';

const runCodes = (session: Session): LobbyStageCode[] => {
  const { endpoint, seed, snapshot } = session;
  return [
    ...networkCodes({ host: hostLabel(snapshot.host), ip: endpoint?.host, port: endpoint?.port }, addressOf(endpoint)),
    ...(seed ? [{ label: RUN_STAGE_TEXT.seed, value: seed, copyLabel: RUN_STAGE_TEXT.copySeed }] : []),
  ];
};

export { runCodes };
