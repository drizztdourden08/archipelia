/* @layer core @kind logic */
import type { SessionPlayer, SetPlayer } from './session.type';

const isSet = (player: SessionPlayer): player is SetPlayer => player.kind === 'set';

export { isSet };
