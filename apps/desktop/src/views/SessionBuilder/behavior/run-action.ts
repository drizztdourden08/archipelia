/* @layer renderer-app @kind logic */
import type { AdminLobby, SessionTemplate } from '@archipelia/model';
import { readySlots } from '../../../lobbies/ready-slots';
import type { RunAction, RunHandlers } from '../SessionBuilder.type';
import { RUN_TEXT, RUNNABLE_PHASES } from './run-action.constants';

const runWith = (run: () => void, reason?: string): RunAction => ({ label: RUN_TEXT.run, reason, onClick: run });

const lobbyAction = (players: number, lobby: AdminLobby, run: () => void): RunAction => {
  if (!RUNNABLE_PHASES.includes(lobby.phase)) return runWith(run, RUN_TEXT.running);
  const ready = players + readySlots(lobby.members.filter((member) => member.kind === 'client'));
  return runWith(run, ready > 0 ? undefined : RUN_TEXT.nobodyReady);
};

const runAction = ({ direct, players }: SessionTemplate, lobbies: readonly AdminLobby[] | undefined, { run, open }: RunHandlers): RunAction => {
  if (!direct) return runWith(run, players.length > 0 ? undefined : RUN_TEXT.addPlayer);
  if (direct.lobbyId && !lobbies) return runWith(run, RUN_TEXT.loading);
  const lobby = direct.lobbyId ? lobbies?.find((entry) => entry.id === direct.lobbyId) : undefined;
  if (!lobby || lobby.phase === 'closed') return { label: RUN_TEXT.open, onClick: open };
  return lobbyAction(players.length, lobby, run);
};

export { runAction };
