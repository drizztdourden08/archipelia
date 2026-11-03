/* @layer renderer-app @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import type { GroupCountsProps } from './GroupCounts.type';

const GroupCounts = ({ counts }: GroupCountsProps) => (
  <Box as="span" className="spoiler-groups__counts">
    {counts.map(({ key, value, label }, at) => (
      <Box as="span" key={key}>
        {at > 0 && <Text tone="faint"> · </Text>}
        <Text className={`spoiler-groups__count--${key}`}>{value}</Text>
        <Text tone="faint"> {label}</Text>
      </Box>
    ))}
  </Box>
);

export { GroupCounts };
