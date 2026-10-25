/* @layer renderer-app @kind types */
import type { SlotState } from '@archipelia/model';

type JoinSource = { kind: 'preset'; presetId: string } | { kind: 'yaml'; fileName: string; yaml: string };

type JoinRequest = { address: string; code: string; displayName: string; slotName: string; game: string; source: JoinSource };

type JoinState = 'connecting' | 'pending' | 'approved' | 'started' | 'refused' | 'failed' | 'offline' | 'ended';

type JoinFile = { name: string; size: number; saved?: string };

type JoinResults = {
  seed: string;
  address: string;
  localAddress?: string;
  sameComputer: boolean;
  password?: string;
  roomUrl?: string;
  slot: string;
  game: string;
  files: JoinFile[];
};

type JoinView = {
  id: string;
  address: string;
  code: string;
  displayName: string;
  slotName: string;
  game: string;
  state: JoinState;
  lobbyName?: string;
  ap?: string;
  slotState?: SlotState;
  message?: string;
  results?: JoinResults;
  createdAt: number;
  updatedAt: number;
};

export type { JoinFile, JoinRequest, JoinResults, JoinSource, JoinState, JoinView };
