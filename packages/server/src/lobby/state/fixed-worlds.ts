/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';

const fixedWorlds = (lobby: Lobby, except?: string): Map<string, string> => {
  const fixed = new Map<string, string>();
  for (const member of lobby.members) {
    if (member.id === except || member.admission === 'refused' || member.admission === 'removed') continue;
    for (const slot of member.slots) {
      if (slot.worldVersion !== undefined && slot.state !== 'refused' && !fixed.has(slot.game)) fixed.set(slot.game, slot.worldVersion);
    }
  }
  return fixed;
};

export { fixedWorlds };
