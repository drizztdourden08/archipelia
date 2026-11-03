/* @layer core @kind logic */
import type { SessionPlayer } from '@archipelia/model';
import type { ProblemField, TemplateProblem } from './validate-players.type';

const playerProblem = (player: SessionPlayer, field: ProblemField, message: string): TemplateProblem => ({ slot: player.slot, field, message });

export { playerProblem };
