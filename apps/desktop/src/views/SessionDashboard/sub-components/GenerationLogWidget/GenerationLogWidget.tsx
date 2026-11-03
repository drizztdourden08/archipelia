/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { useWidgetState } from '@drizztdourden08/brock-react';
import { LogLines } from '@archipelia/design';
import { GENERATE_LOG } from '../../SessionDashboard.constants';
import { textRows } from '../../behavior/text-rows';
import { useSessionText } from '../../behavior/useSessionText';
import { TextState } from '../TextState';
import type { GenerationLogWidgetProps } from './GenerationLogWidget.type';

const GenerationLogWidget = ({ session }: GenerationLogWidgetProps) => {
  const text = useSessionText(session.id, GENERATE_LOG);
  const [search, setSearch] = useWidgetState('search', '');
  const rows = useMemo(() => textRows(text.value), [text.value]);
  return (
    <LogLines
      rows={rows}
      search={search}
      onSearchChange={setSearch}
      emptyLabel="This file is empty or missing."
      filterPlacement="left"
      size="sm"
      placeholder={text.loading || text.failed ? <TextState failed={text.failed} loadingLabel="Loading the log" onRetry={text.retry} /> : undefined}
    />
  );
};

export { GenerationLogWidget };
