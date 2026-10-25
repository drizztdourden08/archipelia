/* @layer core @kind logic */
import { LOBBY_TEMPLATE_PREFIX } from './shared-ids.constants';

const lobbyTemplateId = (lobbyId: string): string => `${LOBBY_TEMPLATE_PREFIX}${lobbyId}`;

export { lobbyTemplateId };
