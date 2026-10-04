/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import { useWidgetState } from '@drizztdourden08/brock-react';
import { Box, Button, EmptyState, Icon } from '@drizztdourden08/tessera/primitives';
import type { SpoilerWidgetProps } from './SpoilerWidget.type';
import { useSessionText } from '../../behavior/useSessionText';
import { spoilerFileOf } from '../../behavior/spoiler-file-of';
import { textRows } from '../../behavior/text-rows';
import { LogLines } from '@archipelia/design';
import { TextState } from '../TextState';

const SpoilerWidget = ({ session }: SpoilerWidgetProps) => {
  const file = spoilerFileOf(session);
  const [shown, setShown] = useWidgetState(`shown:${session.id}`, false);
  const text = useSessionText(session.id, shown ? file : null);
  const [search, setSearch] = useWidgetState('search', '');
  const rows = useMemo(() => textRows(text.value), [text.value]);
  const show = useCallback(() => setShown(true), [setShown]);
  const hide = useCallback(() => setShown(false), [setShown]);
  if (!file) return <EmptyState message="This session has no spoiler. Raise the spoiler level in the session to get one." />;
  if (!shown) {
    const action = <Button variant="secondary" icon={<Icon name="eye" />} onClick={show}>Show spoiler</Button>;
    return <EmptyState icon={<Icon name="eye-off" />} message="The spoiler is covered so it gives nothing away." action={action} />;
  }
  return (
    <Box className="session-panel session-panel--fill">
      <LogLines
        rows={rows}
        search={search}
        onSearchChange={setSearch}
        emptyLabel="The spoiler file is empty or missing."
        toolbarExtra={<Button size="sm" variant="secondary" icon={<Icon name="eye-off" />} onClick={hide}>Hide spoiler</Button>}
        placeholder={text.loading || text.failed ? <TextState failed={text.failed} loadingLabel="Loading the spoiler" onRetry={text.retry} /> : undefined}
      />
    </Box>
  );
};

export { SpoilerWidget };
