/* @layer renderer-app @kind component */
import { Box, SegmentedControl, Select, Text } from '@drizztdourden08/tessera/primitives';
import type { SpoilerControlsProps } from './SpoilerControls.type';

const SpoilerControls = ({ groupBy, view }: SpoilerControlsProps) => (
  <Box className="spoiler-controls">
    {groupBy && (
      <>
        <Text as="span" variant="overline" tone="dim">{groupBy.label}</Text>
        <Select value={groupBy.value} options={groupBy.options} onChange={groupBy.onChange} aria-label={groupBy.label} />
      </>
    )}
    {view && <SegmentedControl size="sm" value={view.value} options={view.options} onChange={view.onChange} aria-label={view.label} />}
  </Box>
);

export { SpoilerControls };
