/* @layer renderer-app @kind component */
import { Card, EmptyState, SectionHeader, Spinner, Stack } from '@drizztdourden08/tessera/primitives';
import { TOUR_TARGET } from '../../../../hooks/tour-targets.constants';
import type { SessionsCardProps } from './SessionsCard.type';
import { SessionRow } from '@archipelia/design';
import { historyLabel } from '../../behavior/history-label';
import { templateMeta } from '../../behavior/template-meta';
import { playersLabel } from '../../behavior/players-label';

const SessionsCard = ({ templates, total, loading, servers, runCounts, isBusy, onEdit, onStart, onHistory, onDuplicate, onDelete }: SessionsCardProps) => {
  const empty = loading
    ? <EmptyState icon={<Spinner />} message="Loading your sessions" />
    : <EmptyState message={total ? 'No session matches' : 'No session yet. New session builds one.'} />;
  return (
    <Card data-tour={TOUR_TARGET.sessionsList}>
      <Stack gap="sm">
        <SectionHeader title={`Sessions · ${total}`} />
        {templates.length === 0
          ? empty
          : templates.map((template) => (
            <SessionRow
              key={template.id}
              id={template.id}
              name={template.name}
              meta={templateMeta(template, servers)}
              playersLabel={playersLabel(template.players.length)}
              historyLabel={historyLabel(runCounts[template.id] ?? 0)}
              busy={isBusy(template.id)}
              onEdit={onEdit}
              onStart={onStart}
              onHistory={onHistory}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          ))}
      </Stack>
    </Card>
  );
};

export { SessionsCard };
