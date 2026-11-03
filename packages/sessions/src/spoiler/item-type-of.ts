/* @layer core @kind logic */
import { placementKey } from './placement-key';
import type { SpoilerItemType, SpoilerItemTypes, SpoilerPlacement } from './spoiler.type';

const classOf = (types: SpoilerItemTypes, { finder, location }: SpoilerPlacement) => {
  const exact = types.classes.get(placementKey(finder, location));
  const only = types.players.length === 1 ? types.players[0] : undefined;
  return exact ?? (only === undefined ? undefined : types.classes.get(placementKey(only, location)));
};

const itemTypeOf = (placement: SpoilerPlacement, types: SpoilerItemTypes | null): SpoilerItemType =>
  (types && classOf(types, placement)) ?? (placement.required ? 'required' : 'unknown');

export { itemTypeOf };
