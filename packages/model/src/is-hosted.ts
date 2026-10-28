/* @layer core @kind logic */
import type { HostedPlayer, SessionPlayer } from './session.type';

const isHosted = (player: SessionPlayer): player is HostedPlayer => player.game !== undefined && player.source !== undefined;

export { isHosted };
