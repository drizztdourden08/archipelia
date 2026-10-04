/* @layer renderer-app @kind component */
import { Card, EmptyState, SectionHeader, Spinner, Stack } from '@drizztdourden08/tessera/primitives';
import type { RunsCardProps } from './RunsCard.type';
import { RunRow } from '@archipelia/design';
import { runSummary } from '../../behavior/run-summary';

const RunsCard = ({ runs, total, loading, isBusy, onOpen, onShowLog, onDelete }: RunsCardProps) => {
  const empty = loading
    ? <EmptyState icon={<Spinner />} message="Loading your runs" />
    : <EmptyState message={total ? 'No run matches' : 'No run yet. Run a session to start one.'} />;
  return (
    <Card>
      <Stack gap="sm">
        <SectionHeader title={`Runs · ${total}`} />
        {runs.length === 0
          ? empty
          : (
            <Stack gap="sm" role="list" aria-label="Runs">
              {runs.map((run) => (
                <RunRow key={run.id} {...runSummary(run)} busy={isBusy(run.id)} onOpen={onOpen} onShowLog={onShowLog} onDelete={onDelete} />
              ))}
            </Stack>
          )}
      </Stack>
    </Card>
  );
};

export { RunsCard };
