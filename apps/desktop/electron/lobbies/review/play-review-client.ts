/* @layer electron-main @kind logic */
import fixture from '@drizztdourden08/archipelia-lobby-protocol/fixtures/unlisted-consent.jsonl?raw';
import type { HostHook, ScenarioResult } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import { connectWebSocket, createFakeClient, createScenarioKit, parseFixture, SCENARIO_CATALOG } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import { LOBBY_PATH } from '@drizztdourden08/archipelia-lobby-protocol';
import type { LobbyReviewPlay } from '../../../src/lobbies/lobbies.type';
import { FIXTURE_AP, FIXTURE_CODE, FIXTURE_NAME, PLAY_TIMEOUT_MS, REVIEW_HOST, SCENARIO } from './review.constants';

const playReviewClient = async ({ code, name, ap }: LobbyReviewPlay, port: number, host: HostHook): Promise<ScenarioResult> => {
  const entry = SCENARIO_CATALOG.find((candidate) => candidate.name === SCENARIO);
  if (!entry) throw new Error(`there is no scenario named ${SCENARIO}`);
  const text = fixture.replaceAll(FIXTURE_CODE, code).replaceAll(FIXTURE_NAME, name).replaceAll(FIXTURE_AP, ap);
  const url = `ws://${REVIEW_HOST}:${port}${LOBBY_PATH}`;
  return createFakeClient({
    scenario: { ...entry, lines: parseFixture(text, SCENARIO) }, kit: createScenarioKit(), ignore: ['lobby.state'], timeoutMs: PLAY_TIMEOUT_MS,
    connect: () => connectWebSocket(url), host,
  }).play();
};

export { playReviewClient };
