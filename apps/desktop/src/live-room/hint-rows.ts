/* @layer renderer-app @kind logic */
import type { HintLookup, HintState, HintView, ProtocolHint } from './live-room.type';
import { STATE_BY_CODE, STATE_ORDER } from './hint-rows.constants';

const hintKey = (hint: ProtocolHint) => `${hint.finding_player}-${hint.location}`;

const hintStateOf = (hint: ProtocolHint): HintState => (hint.found ? 'found' : STATE_BY_CODE[hint.status ?? 0] ?? 'open');

const hintView = (hint: ProtocolHint, lookup: HintLookup): HintView => ({
  key: hintKey(hint),
  item: lookup.itemName(lookup.gameOf(hint.receiving_player), hint.item),
  receiver: lookup.playerName(hint.receiving_player),
  finder: lookup.playerName(hint.finding_player),
  location: lookup.locationName(lookup.gameOf(hint.finding_player), hint.location),
  entrance: hint.entrance && hint.entrance !== 'Vanilla' ? hint.entrance : '',
  state: hintStateOf(hint),
});

const hintRows = (lists: readonly (readonly ProtocolHint[])[], lookup: HintLookup): HintView[] => {
  const byKey = new Map<string, ProtocolHint>();
  lists.flat().forEach((hint) => byKey.set(hintKey(hint), hint));
  return [...byKey.values()]
    .map((hint) => hintView(hint, lookup))
    .sort((a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state] || a.receiver.localeCompare(b.receiver) || a.item.localeCompare(b.item));
};

export { hintRows };
