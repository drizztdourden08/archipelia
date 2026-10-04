/* @layer renderer-app @kind component */
import { Card, EmptyState, SectionHeader, Stack } from '@drizztdourden08/tessera/primitives';
import type { RunsCardProps } from './RunsCard.type';
import { RunRow } from '@archipelia/design';
import { runSummary } from '../../behavior/run-summary';

const RunsCard = ({ runs, total, isBusy, onOpen, onShowLog, onDelete }: RunsCardProps) => (
  <Card>
    <Stack gap="sm">
      <SectionHeader title={`Runs · ${total}`} />
      {runs.length === 0
        ? <EmptyState message={total ? 'No run matches' : 'No run yet. Run a session to start one.'} />
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

export { RunsCard };
