/* @layer renderer-app @kind component */
import { Badge, Box, Icon, Tag, Text } from '@drizztdourden08/tessera/primitives';
import { ItemMark } from '../ItemMark';
import type { SpoilerRowItemProps } from './SpoilerRowItem.type';

const SpoilerRowItem = ({ row, view }: SpoilerRowItemProps) => {
  const { primary, secondary, mark, receiver, sphere, detail } = row;
  return (
    <Box className={`spoiler-row spoiler-row--${mark?.tone ?? 'unknown'}`}>
      <Box className="spoiler-row__line">
        {mark && <ItemMark {...mark} />}
        <Text className="spoiler-row__location" title={primary}>{primary}</Text>
        {secondary !== undefined && (
          <>
            <Icon name="arrow-right" size={10} className="spoiler-row__arrow" />
            <Text className="spoiler-row__item" title={secondary}>{secondary}</Text>
          </>
        )}
        {receiver !== undefined && <Tag variant="urgency" color="info" title={`Goes to ${receiver}`}>{receiver}</Tag>}
        {sphere != null && <Badge variant="inline" color="tame" value={`S${sphere}`} label={`Sphere ${sphere}`} />}
      </Box>
      {view === 'detailed' && detail && <Text className="spoiler-row__detail">{detail}</Text>}
    </Box>
  );
};

export { SpoilerRowItem };
