/* @layer core @kind logic */
import { buildRun, runPlayersOf } from '@archipelia/model';
import type { Session, SessionTemplate } from '@archipelia/model';
import type { LobbyRun } from './lobby-run.type';
import { UNKNOWN_SOURCE } from './started-run.constants';

const lobbyRecord = (template: SessionTemplate, lobby: LobbyRun, id: string, createdAt: number): Session => {
  const record = buildRun({ id, createdAt, saved: template, used: template, source: lobby.source, players: lobby.players ?? [] });
  return { ...record, ...(lobby.source ? {} : { source: UNKNOWN_SOURCE }), lobbyId: lobby.lobbyId, worlds: lobby.worlds };
};

const startedRun = (template: SessionTemplate, lobby: LobbyRun | undefined, id: string, createdAt: number): Session =>
  (lobby
    ? lobbyRecord(template, lobby, id, createdAt)
    : buildRun({ id, createdAt, saved: template, used: template, players: runPlayersOf({ saved: template, hosted: template.players }) }));

export { startedRun };
