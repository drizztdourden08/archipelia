/* @layer renderer-app @kind component */
import { ItemList } from '@drizztdourden08/tessera/composites';
import type { ItemListRowParts } from '@drizztdourden08/tessera/composites';
import { Box, Icon, Status } from '@drizztdourden08/tessera/primitives';
import type { Session } from '@archipelia/model';
import { TOUR_TARGET } from '../../../../hooks/tour-targets.constants';
import { statusOf } from '../../behavior/run-status';
import { TEXT } from '../../History.constants';
import { RunMeta } from '../RunMeta';
import type { RunsListProps } from './RunsList.type';

const rowParts = (run: Session): ItemListRowParts => {
  const status = statusOf(run);
  return { icon: <Icon name="history" />, meta: <RunMeta run={run} />, columns: [{ primary: <Status tone={status.tone}>{status.label}</Status>, align: 'end' }] };
};

const RunsList = ({ runs, total, loading, selectedId, onSelect }: RunsListProps) => (
  <Box data-tour={TOUR_TARGET.historyList}>
    <ItemList
      title="Runs"
      showTitle={false}
      items={runs}
      getId={(run) => run.id}
      getName={(run) => run.snapshot.name}
      render={rowParts}
      selectedId={selectedId}
      onSelect={onSelect}
      loading={loading}
      empty={total ? TEXT.noMatch : TEXT.noRuns}
      filter={false}
    />
  </Box>
);

export { RunsList };
