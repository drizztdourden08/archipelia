/* @layer renderer-app @kind logic */
import { itemTypeOf } from '@archipelia/sessions/spoiler';
import type { SpoilerItemTypes, SpoilerPlacement } from '@archipelia/sessions/spoiler';
import { ITEM_TYPE_LABEL, REQUIRED_LABEL, UNKNOWN_GAME, WORLD_LABEL } from '../SpoilerWidget.constants';
import type { SpoilerEntry } from '../SpoilerWidget.type';
import { areaOf } from './area-of';
import { sphereLabelOf } from './sphere-label-of';

const entryOf = (placement: SpoilerPlacement, types: SpoilerItemTypes | null, games: ReadonlyMap<string, string>): SpoilerEntry => {
  const { finder, receiver, item, location } = placement;
  const type = itemTypeOf(placement, types);
  const finderGame = games.get(finder) ?? UNKNOWN_GAME;
  const receiverGame = games.get(receiver) ?? UNKNOWN_GAME;
  return {
    placement,
    type,
    finderGame,
    receiverGame,
    area: areaOf(location),
    text: `${location} ${item} ${finder} ${receiver}`,
    record: {
      game: finderGame,
      finder,
      receiver,
      receiverGame,
      item,
      location,
      sphere: sphereLabelOf(placement.sphere),
      required: placement.required ? REQUIRED_LABEL.yes : REQUIRED_LABEL.no,
      type: ITEM_TYPE_LABEL[type],
      world: finder === receiver ? WORLD_LABEL.own : WORLD_LABEL.other,
    },
  };
};

export { entryOf };
