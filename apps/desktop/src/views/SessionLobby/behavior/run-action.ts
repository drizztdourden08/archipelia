/* @layer renderer-app @kind logic */
import type { AdminLobby, SessionTemplate } from '@archipelia/model';
import { readySlots } from '../../../lobbies/ready-slots';
import type { RunAction } from '../SessionLobby.type';
import { RUN_TEXT, RUNNABLE_PHASES } from './run-action.constants';

const runWith = (run: () => void, reason?: string): RunAction => ({ label: RUN_TEXT.run, reason, onClick: run });

const runAction = ({ direct, players }: SessionTemplate, lobby: AdminLobby | undefined, run: () => void): RunAction => {
  if (!lobby) return runWith(run, RUN_TEXT.loading);
  if (!RUNNABLE_PHASES.includes(lobby.phase)) return runWith(run, RUN_TEXT.running);
  const ready = players.length + readySlots(lobby.members.filter((member) => member.kind === 'client'));
  if (ready > 0) return runWith(run);
  return runWith(run, direct ? RUN_TEXT.nobodyReady : RUN_TEXT.addPlayer);
};

export { runAction };
