/* @layer renderer-app @kind logic */
import { formatLobbyCode } from '@drizztdourden08/archipelia-lobby-protocol';
import { defineReviewStep, nav } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { appApi } from '../ipc/app-api';
import type { LobbyReviewHost } from '../lobbies/lobbies.type';
import { LOCAL_SERVER } from '../lobbies/lobbies.constants';
import { useLobbyStore } from '../stores/useLobbyStore';
import { LOBBY_UI, REVIEW_LOBBY, REVIEW_PLAYER } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { named } from './named';
import { nameOf } from './name-of';
import { waitNamed } from './wait-named';
import { waitText } from './wait-text';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer) ?? undefined;

const knownIds = (): string[] => (useLobbyStore.getState().lobbies[LOCAL_SERVER] ?? []).map((entry) => entry.id);

const lobbyNow = (before: readonly string[]) => useLobbyStore.getState().lobbies[LOCAL_SERVER]?.find((entry) => entry.name === REVIEW_LOBBY && !before.includes(entry.id));

const createInScreen = async (tour: AppReviewTour) => {
  nav.open(ROUTE.lobbies);
  await useLobbyStore.getState().load(LOCAL_SERVER);
  const before = knownIds();
  await clickNamed(tour, SELECTOR.button, LOBBY_UI.create, layer(tour));
  const name = await waitNamed(tour, SELECTOR.field, /^(Name|Friday seed)$/, layer(tour));
  tour.check('lobby-create-form', name !== null, 'New lobby opens the create form', 'the create form did not open');
  if (name instanceof HTMLInputElement) tour.typeText(name, REVIEW_LOBBY);
  const toggle = await waitNamed(tour, SELECTOR.toggle, new RegExp(LOBBY_UI.unlisted), layer(tour));
  if (toggle) tour.click(toggle);
  await tour.capture('lobby-form');
  await clickNamed(tour, SELECTOR.button, LOBBY_UI.submit, layer(tour));
  const made = await tour.waitFor(() => lobbyNow(before), 15000);
  if (!made) await tour.capture('lobby-create-failed');
  tour.check('lobby-created', made !== null, 'Create lobby opens the lobby on the embedded server', 'the lobby was not created');
  return made;
};

const allowWorld = async (tour: AppReviewTour) => {
  await clickNamed(tour, SELECTOR.button, /^Review the world of /, layer(tour));
  const dialog = await waitNamed(tour, SELECTOR.dialog, /^Allow this world\?/);
  const focused = document.activeElement instanceof HTMLElement ? nameOf(document.activeElement) : '';
  tour.check('consent-focus', dialog !== null && focused === 'Refuse', 'the consent dialog focuses Refuse', `the consent dialog focused "${focused}"`);
  await tour.capture('lobby-consent');
  if (dialog) await clickNamed(tour, SELECTOR.button, 'Allow this world', dialog);
};

const answerHost = (tour: AppReviewTour) => async (host: LobbyReviewHost) => {
  if (host.action === 'approve') {
    await tour.capture('lobby-waiting');
    await clickNamed(tour, SELECTOR.button, /^Approve /, layer(tour));
  }
  if (host.action === 'consent') await allowWorld(tour);
  await appApi().lobbyReviewHostDone(host.id);
};

const joinFakeClient = async (tour: AppReviewTour, ap: string, code: string) => {
  const stop = appApi().onLobbyReviewHost((host) => { void answerHost(tour)(host); });
  const result = await appApi().lobbyReviewPlay({ code, name: REVIEW_LOBBY, ap }).finally(stop);
  tour.check('fake-client', result.ok, 'the fake client joined, uploaded, was approved and its world allowed in the screens', result.failure ?? 'the fake client failed');
};

const startAndCheck = async (tour: AppReviewTour) => {
  const button = await tour.waitFor(() => {
    const found = named(tour, SELECTOR.button, new RegExp(`^${LOBBY_UI.start}$`), layer(tour));
    return found instanceof HTMLButtonElement && !found.disabled ? found : null;
  });
  tour.check('lobby-start', button !== null, 'Start is on once a slot is ready', 'Start never turned on');
  if (button) tour.click(button);
  const seen = await waitText(tour, `${REVIEW_PLAYER}.apreview`, () => layer(tour) ?? null, 20000);
  tour.check('lobby-results', seen, 'the results list the room address, the seed and the file of the player', 'the results did not show the file of the player');
  await tour.capture('lobby-results');
};

const closeLobby = async (tour: AppReviewTour) => {
  await clickNamed(tour, SELECTOR.button, LOBBY_UI.close, layer(tour));
  await tour.capture('lobby-close-asks');
  const confirm = await waitNamed(tour, SELECTOR.button, /^Close lobby$/, layer(tour));
  if (confirm) tour.click(confirm);
  const closed = await waitText(tour, 'Closed', () => layer(tour) ?? null);
  tour.check('lobby-close', closed, 'Close lobby asks first and the lobby reads Closed', 'the lobby did not close');
};

export default defineReviewStep({
  run: async (tour) => {
    const status = await appApi().lobbyServerStatus();
    tour.check('lobby-server', status.state === 'listening', 'the embedded lobby server listens', `the lobby server is ${status.state}: ${status.error ?? ''}`);
    if (status.state !== 'listening') return;
    const lobby = await createInScreen(tour);
    if (!lobby) return;
    const code = formatLobbyCode(lobby.code) ?? lobby.code;
    const shown = await waitText(tour, code, () => layer(tour) ?? null);
    tour.check('lobby-code', shown, 'the lobby screen shows the code in a copy box', 'the lobby screen does not show the code');
    await joinFakeClient(tour, lobby.engine.ap, code);
    await startAndCheck(tour);
    await closeLobby(tour);
  },
});
