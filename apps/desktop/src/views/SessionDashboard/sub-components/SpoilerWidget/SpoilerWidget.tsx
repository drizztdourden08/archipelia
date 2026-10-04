/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { useWidgetState } from '@drizztdourden08/brock-react';
import { Box, EmptyState } from '@drizztdourden08/tessera/primitives';
import type { SpoilerWidgetProps } from './SpoilerWidget.type';
import { useSessionText } from '../../behavior/useSessionText';
import { spoilerFileOf } from '../../behavior/spoiler-file-of';
import { textRows } from '../../behavior/text-rows';
import { LogLines } from '@archipelia/design';

const SpoilerWidget = ({ session }: SpoilerWidgetProps) => {
  const file = spoilerFileOf(session);
  const text = useSessionText(session.id, file);
  const [search, setSearch] = useWidgetState('search', '');
  const rows = useMemo(() => textRows(text.value), [text.value]);
  if (!file) return <EmptyState message="This session has no spoiler. Raise the spoiler level in the session to get one." />;
  return (
    <Box className="session-panel session-panel--fill">
      <LogLines
        rows={rows}
        search={search}
        onSearchChange={setSearch}
        emptyLabel={text.loading ? 'Loading' : 'The spoiler file is empty or missing.'}
      />
    </Box>
  );
};

export { SpoilerWidget };
