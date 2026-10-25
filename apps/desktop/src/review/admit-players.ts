/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { formatLobbyCode } from '@drizztdourden08/archipelia-lobby-protocol';
import type { AdminLobby } from '@archipelia/model';
import { appApi } from '../ipc/app-api';
import type { LobbyReviewHost } from '../lobbies/lobbies.type';
import { REVIEW_DIRECT, REVIEW_JOINER, REVIEW_PLAYER } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { directLobby } from './direct-lobby';
import { nameOf } from './name-of';
import { named } from './named';
import { waitNamed } from './wait-named';
import { withHeartbeat } from './with-heartbeat';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer) ?? undefined;

const enabled = (tour: AppReviewTour, name: string) => {
  const found = named(tour, SELECTOR.button, name, layer(tour));
  return found instanceof HTMLButtonElement && !found.disabled ? found : null;
};

const allowWorld = async (tour: AppReviewTour, player: string) => {
  const review = await tour.waitFor(() => enabled(tour, `Review the world of ${player}`), 15000);
  if (review) tour.click(review);
  const dialog = await waitNamed(tour, SELECTOR.dialog, /^Allow this world\?/);
  const focused = document.activeElement instanceof HTMLElement ? nameOf(document.activeElement) : '';
  tour.check(`consent-focus-${player}`, dialog !== null && focused === 'Refuse', 'the consent dialog focuses Refuse', `the consent dialog focused "${focused}"`);
  if (dialog) await clickNamed(tour, SELECTOR.button, 'Allow this world', dialog);
};

const answerHost = (tour: AppReviewTour) => async (host: LobbyReviewHost) => {
  if (host.action === 'approve') {
    await tour.capture('direct-waiting');
    await clickNamed(tour, SELECTOR.button, `Approve ${REVIEW_PLAYER}`, layer(tour));
  }
  if (host.action === 'consent') await allowWorld(tour, REVIEW_PLAYER);
  await appApi().lobbyReviewHostDone(host.id);
};

const slotReady = (lobbyId: string, name: string) =>
  directLobby(lobbyId)?.members.some((member) => member.displayName === name && member.admission === 'approved' && member.slots.every((slot) => slot.state === 'ok')) ? true : null;

const worldAsked = (tour: AppReviewTour) => tour.findAll(SELECTOR.button, layer(tour)).some((el) => nameOf(el) === `Review the world of ${REVIEW_JOINER}`);

const admitJoiner = async (tour: AppReviewTour, lobbyId: string) => {
  const approve = await tour.waitFor(() => enabled(tour, `Approve ${REVIEW_JOINER}`), 15000);
  if (approve) tour.click(approve);
  const consent = await tour.waitFor(() => slotReady(lobbyId, REVIEW_JOINER) ?? (worldAsked(tour) ? true : null), 15000);
  if (consent && !slotReady(lobbyId, REVIEW_JOINER)) await allowWorld(tour, REVIEW_JOINER);
  const ready = await tour.waitFor(() => slotReady(lobbyId, REVIEW_JOINER), 20000);
  tour.check('join-approved', ready === true, 'Host approval in the session admits the Archipelia player and its slot gets ready', 'the Archipelia player did not get a ready slot');
};

const admitPlayers = async (tour: AppReviewTour, lobby: AdminLobby) => {
  const stop = appApi().onLobbyReviewHost((host) => { void answerHost(tour)(host); });
  const play = appApi().lobbyReviewPlay({ code: formatLobbyCode(lobby.code) ?? lobby.code, name: REVIEW_DIRECT, ap: lobby.engine.ap }).finally(stop);
  const result = await withHeartbeat(tour, play, () => 'the fake client is still joining the session');
  tour.check('fake-client', result.ok, 'a fake client joined the session, was approved and its world allowed in the session editor', result.failure ?? 'the fake client failed');
  await withHeartbeat(tour, admitJoiner(tour, lobby.id), () => 'the Archipelia player is still being admitted');
  await tour.capture('direct-players');
};

export { admitPlayers };
