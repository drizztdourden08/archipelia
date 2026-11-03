/* @layer core @kind logic */
import type { SetPlayer } from '@archipelia/model';
import type { ProblemField, TemplateProblem } from './validate-players.type';

const playerProblem = (player: SetPlayer, field: ProblemField, message: string): TemplateProblem => ({ slot: player.slot, field, message });

export { playerProblem };
