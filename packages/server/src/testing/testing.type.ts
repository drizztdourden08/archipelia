/* @layer core @kind types */
import type { DataFiles, Session, SessionTemplate } from '@archipelia/model';
import type { LobbyRun } from '@archipelia/sessions';
import type { LobbyStore, LobbyTrust } from '../lobby/lobby-service.type';
import type { SandboxRunner } from '../sandbox/sandbox.type';

type RigRun = (template: SessionTemplate, lobby: LobbyRun) => Promise<Session>;

type TestDepsInput = {
  store: LobbyStore;
  output: DataFiles;
  root: string;
  trust: LobbyTrust;
  run: RigRun;
  sandbox?: SandboxRunner;
};

export type { RigRun, TestDepsInput };
