/* @layer renderer-app @kind component */
import { useState } from 'react';
import { Box, Button } from '@drizztdourden08/tessera/primitives';
import { PAGE_SIZE } from '../../SpoilerGroups.constants';
import { SpoilerRowItem } from '../SpoilerRowItem';
import type { SpoilerRowListProps } from './SpoilerRowList.type';

const SpoilerRowList = ({ rows, view }: SpoilerRowListProps) => {
  const [limit, setLimit] = useState(PAGE_SIZE);
  const rest = rows.length - limit;
  return (
    <Box className="spoiler-rows">
      {rows.slice(0, limit).map((row) => <SpoilerRowItem key={row.id} row={row} view={view} />)}
      {rest > 0 && (
        <Box className="spoiler-rows__more">
          <Button size="sm" variant="tertiary" onClick={() => setLimit(limit + PAGE_SIZE)}>
            Show {Math.min(rest, PAGE_SIZE)} more ({rest} left)
          </Button>
        </Box>
      )}
    </Box>
  );
};

export { SpoilerRowList };
