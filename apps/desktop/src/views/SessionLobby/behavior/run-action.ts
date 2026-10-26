/* @layer renderer-app @kind logic */
import type { AdminLobby, SessionTemplate } from '@archipelia/model';
import { readySlots } from '../../../lobbies/ready-slots';
import type { RunAction, RunHandlers } from '../SessionLobby.type';
import { RUN_TEXT, RUNNABLE_PHASES } from './run-action.constants';

const runWith = (run: () => void, reason?: string): RunAction => ({ label: RUN_TEXT.run, reason, onClick: run });

const lobbyAction = ({ direct, players }: SessionTemplate, lobby: AdminLobby, run: () => void): RunAction => {
  if (!RUNNABLE_PHASES.includes(lobby.phase)) return runWith(run, RUN_TEXT.running);
  const ready = players.length + readySlots(lobby.members.filter((member) => member.kind === 'client'));
  if (ready > 0) return runWith(run);
  return runWith(run, direct ? RUN_TEXT.nobodyReady : RUN_TEXT.addPlayer);
};

const runAction = (template: SessionTemplate, lobbies: readonly AdminLobby[] | undefined, { run, start }: RunHandlers): RunAction => {
  const lobbyId = template.lobby?.lobbyId;
  if (lobbyId && !lobbies) return runWith(run, RUN_TEXT.loading);
  const lobby = lobbyId ? lobbies?.find((entry) => entry.id === lobbyId) : undefined;
  if (!lobby || lobby.phase === 'closed') return { label: RUN_TEXT.start, onClick: start };
  return lobbyAction(template, lobby, run);
};

export { runAction };
