/* @layer testing @kind types */
import type { Capability, LobbyAdmission, LobbyPhase, UploadKind } from '../../protocol/protocol.type';

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

type JsonObject = Record<string, JsonValue>;

type Bindings = Record<string, JsonValue>;

type HostLine = { dir: 'host'; action: string; [param: string]: JsonValue };

type MessageLine = { dir: 'c2s' | 's2c'; msg: JsonObject; invalid?: boolean };

type RawLine = { dir: 'c2s'; raw: string };

type BinaryLine = { dir: 'c2s'; binary: true };

type CloseLine = { dir: 'close'; code: number };

type ConnectLine = { dir: 'connect' };

type FixtureLine = MessageLine | RawLine | BinaryLine | CloseLine | ConnectLine | HostLine;

type ScenarioSlot = { name: string; game: string; worldVersion: string };

type ScenarioOutputFile = { slot: string; fileId: string; name: string; text: string };

type ScenarioSetup = {
  name: string;
  admission: LobbyAdmission;
  allowUnlisted: boolean;
  ap: string;
  phase: LobbyPhase;
  maxSlots: number;
  existingSlots: ScenarioSlot[];
  registry: 'active' | 'revoked';
  outputFile?: ScenarioOutputFile;
};

type ScenarioEntry = {
  name: string;
  title: string;
  requires: Capability[];
  setup: ScenarioSetup;
};

type Scenario = ScenarioEntry & { lines: FixtureLine[] };

type ScenarioFile = { name: string; kind: UploadKind; bytes: Uint8Array; sha256: string };

type ScenarioKit = { files: ScenarioFile[]; values: Bindings };

type ScenarioResult = { ok: boolean; failure?: string; bindings: Bindings };

type HostHook = (line: HostLine, bindings: Bindings) => Promise<void>;

type Wildcard = { accepts: (value: unknown) => boolean; sample: JsonValue };

export type {
  Bindings,
  BinaryLine,
  FixtureLine,
  HostHook,
  HostLine,
  JsonObject,
  JsonValue,
  MessageLine,
  RawLine,
  Scenario,
  ScenarioEntry,
  ScenarioFile,
  ScenarioKit,
  ScenarioResult,
  ScenarioSetup,
  ScenarioSlot,
  Wildcard,
};
