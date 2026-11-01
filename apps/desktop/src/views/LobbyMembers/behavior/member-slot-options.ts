/* @layer renderer-app @kind logic */
import type { InstalledGame, MemberYaml } from '@archipelia/model';
import { OPTION_TEXT } from '../LobbyMembers.constants';
import type { SlotOptions } from '../LobbyMembers.type';
import { optionsOfYaml } from './options-of-yaml';

const memberSlotOptions = (sent: MemberYaml, installed: readonly InstalledGame[]): SlotOptions[] =>
  sent.slots.map((slot) => {
    const schema = installed.find((entry) => entry.game === slot.game)?.schema;
    const read = slot.yaml === null ? { groups: [], problem: OPTION_TEXT.notSent } : optionsOfYaml(slot.yaml, slot.game, schema);
    return { name: slot.name, game: slot.game, yaml: slot.yaml, known: schema !== undefined, ...read };
  });

export { memberSlotOptions };
