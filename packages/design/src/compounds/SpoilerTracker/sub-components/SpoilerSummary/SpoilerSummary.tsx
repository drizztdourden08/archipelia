/* @layer renderer-app @kind component */
import { Box, Icon, Text } from '@drizztdourden08/tessera/primitives';
import type { SpoilerSummaryProps } from './SpoilerSummary.type';

const SpoilerSummary = ({ stats }: SpoilerSummaryProps) => (
  <Box className="spoiler-summary" role="group" aria-label="Spoiler summary">
    {stats.map(({ key, label, value, icon, title }) => (
      <Box key={key} className={`spoiler-summary__stat spoiler-summary__stat--${key}`} title={title ?? label}>
        <Icon name={icon} size={12} />
        <Text className="spoiler-summary__value">{value}</Text>
        <Text className="spoiler-summary__label">{label}</Text>
      </Box>
    ))}
  </Box>
);

export { SpoilerSummary };
