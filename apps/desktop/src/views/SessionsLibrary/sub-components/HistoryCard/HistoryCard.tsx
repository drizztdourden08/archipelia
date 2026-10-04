/* @layer renderer-app @kind component */
import { Card, EmptyState, SectionHeader, Stack } from '@drizztdourden08/tessera/primitives';
import type { HistoryCardProps } from './HistoryCard.type';
import { RunRow } from '@archipelia/design';
import { runSummary } from '../../behavior/run-summary';

const HistoryCard = ({ runs, total, isBusy, onOpen, onShowLog, onDelete }: HistoryCardProps) => (
  <Card>
    <Stack gap="sm">
      <SectionHeader title={`History · ${total}`} />
      {runs.length === 0
        ? <EmptyState message={total ? 'No run matches' : 'No run yet. Run a template to start one.'} />
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

export { HistoryCard };
