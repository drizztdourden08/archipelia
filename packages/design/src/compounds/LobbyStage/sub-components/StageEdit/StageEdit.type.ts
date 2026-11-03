/* @layer renderer-app @kind types */
import type { LobbyStageConfig } from '../../LobbyStage.type';

type StageEditProps = Pick<LobbyStageConfig, 'editLabel' | 'onEdit' | 'locked'>;

export type { StageEditProps };
