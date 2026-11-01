/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { LOBBY_STAGE, REVIEW_PLAYER, REVIEW_PLAYERS, SEAT_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { checkSeatGrid } from './check-seat-grid';
import { nameOf } from './name-of';
import { tabBody } from './tab-body';

const seats = (tour: AppReviewTour, state: string) => tour.findAll(`${SEAT_UI.card}[data-state="${state}"]`, tabBody(tour));

const checkOwnSeats = (tour: AppReviewTour) => {
  const [saved] = REVIEW_PLAYERS;
  const ready = seats(tour, SEAT_UI.filled).some((seat) => seat.innerText.includes(saved) && seat.innerText.includes(SEAT_UI.ready));
  tour.check('lobby-stage-saved', ready, `the saved player ${saved} sits on a filled seat marked Ready`, `the saved player ${saved} has no Ready seat`);
  const held = seats(tour, SEAT_UI.held).some((seat) => seat.innerText.includes(`Waiting for ${LOBBY_STAGE.held} to connect`));
  tour.check('lobby-stage-held', held, `the held seat says it waits for ${LOBBY_STAGE.held} to connect`, 'there is no held seat');
  const added = seats(tour, SEAT_UI.filled).some((seat) => tour.findAll(SELECTOR.button, seat).some((button) => nameOf(button).startsWith(SEAT_UI.keep)));
  tour.check('lobby-stage-added', added, 'the player added here offers Keep in session', 'no added seat offers Keep in session');
};

const checkArt = (tour: AppReviewTour) => {
  const avatars = tour.findAll('.lobby-seat__avatar', tabBody(tour));
  const square = avatars.length >= 3 && avatars.every((avatar) => Math.abs(avatar.offsetWidth - avatar.offsetHeight) <= 1 && (avatar.dataset.art !== undefined || avatar.innerText.trim().length > 0));
  tour.check('lobby-stage-art', square, `${avatars.length} seats show a square art tile or initials`, 'a seat art tile is missing, empty or not square');
};

const checkStage = (tour: AppReviewTour) => {
  const text = tabBody(tour)?.innerText ?? '';
  tour.check('lobby-stage-config', LOBBY_STAGE.config.test(text), 'the stage ends with the config line and its Edit', 'the stage has no config line with the session settings');
  tour.check('lobby-stage-count', LOBBY_STAGE.count.test(text), 'the header counts the players', 'the header does not count the players');
};

const checkLobbyStage = (tour: AppReviewTour) => {
  checkSeatGrid(tour, REVIEW_PLAYER);
  checkOwnSeats(tour);
  checkArt(tour);
  checkStage(tour);
};

export { checkLobbyStage };
