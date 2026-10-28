/* @layer core @kind logic */
import { isHosted } from './is-hosted';
import type { HostedPlayer, SessionPlayer } from './session.type';

const hostedPlayers = (players: readonly SessionPlayer[]): HostedPlayer[] => players.filter(isHosted);

export { hostedPlayers };
