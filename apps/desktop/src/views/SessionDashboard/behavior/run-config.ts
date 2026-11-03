/* @layer renderer-app @kind logic */
import type { LobbyStageConfig } from '@archipelia/design';
import type { SessionTemplate } from '@archipelia/model';
import { CONFIG_TEXT, configFacts, stageGames } from '../../../stage';
import { RUN_STAGE_TEXT } from './run-stage.constants';

const runConfig = (snapshot: SessionTemplate): LobbyStageConfig => {
  const joining = snapshot.direct ? RUN_STAGE_TEXT.rejoin : CONFIG_TEXT.hostOnly;
  const facts = configFacts(snapshot).map((fact) => (fact.label === CONFIG_TEXT.joining ? { ...fact, value: joining } : fact));
  return { label: RUN_STAGE_TEXT.config, facts, games: stageGames(snapshot.direct), locked: RUN_STAGE_TEXT.locked };
};

export { runConfig };
