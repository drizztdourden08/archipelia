/* @layer core @kind logic */
import type { Failure, Hello, SlotsSet } from '@archipelia/lobby-protocol';
import { checkHello } from '@archipelia/lobby-protocol';
import { SLOT_RULES_HELLO } from './member.constants';

const slotRules = (capabilities: string[], message: SlotsSet): Failure | null => {
  const hello: Hello = { ...SLOT_RULES_HELLO, capabilities, slots: message.slots, worlds: message.worlds };
  return checkHello(hello);
};

export { slotRules };
