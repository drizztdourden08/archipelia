/* @layer renderer-app @kind component */
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import { Badge, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { HintRowProps } from './HintRow.type';

const HintRow = ({ item, receiver, finder, location, entrance, state, stateVariant }: HintRowProps) => {
  const name = `${receiver}'s ${item}`;
  const meta = (
    <Stack gap="xs">
      <Text variant="caption">{`at ${location} in ${finder}'s world`}</Text>
      {entrance && <Text variant="caption">{`via ${entrance}`}</Text>}
    </Stack>
  );
  const badge = <Badge variant={stateVariant}>{state}</Badge>;
  return <ListItemRow role="listitem" name={name} meta={meta} action={badge} />;
};

export { HintRow };
