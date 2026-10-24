/* @layer testing @kind types */
import type { Transport } from '../../node/transport/transport.type';
import type { Bindings, HostHook, Scenario, ScenarioKit, ScenarioResult } from '../scenario/scenario.type';
import type { WebSocketListener } from '../transport/transport.type';

type FakeServerOptions = {
  scenario: Scenario;
  values?: Bindings;
  timeoutMs?: number;
};

type FakeServer = {
  attach: (transport: Transport) => void;
  listen: (port?: number, host?: string) => Promise<WebSocketListener>;
  done: Promise<ScenarioResult>;
};

type FakeClientOptions = {
  scenario: Scenario;
  connect: () => Promise<Transport>;
  kit?: ScenarioKit;
  host?: HostHook;
  ignore?: string[];
  timeoutMs?: number;
};

type FakeClient = { play: () => Promise<ScenarioResult> };

type ScenarioRun = { client: ScenarioResult; server: ScenarioResult };

type RunOptions = {
  clientScenario?: Scenario;
  kit?: ScenarioKit;
  ignore?: string[];
  timeoutMs?: number;
};

export type { FakeClient, FakeClientOptions, FakeServer, FakeServerOptions, RunOptions, ScenarioRun };
