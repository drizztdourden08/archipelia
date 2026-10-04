/* @layer renderer-app @kind component */
import { Card, EmptyState, SectionHeader, Stack } from '@drizztdourden08/tessera/primitives';
import type { SessionsCardProps } from './SessionsCard.type';
import { SessionRow } from '@archipelia/design';
import { templateMeta } from '../../behavior/template-meta';
import { playersLabel } from '../../behavior/players-label';

const SessionsCard = ({ templates, total, servers, isBusy, onEdit, onRun, onDuplicate, onDelete }: SessionsCardProps) => (
  <Card>
    <Stack gap="sm">
      <SectionHeader title={`Sessions · ${total}`} />
      {templates.length === 0
        ? <EmptyState message={total ? 'No session matches' : 'No session yet. New session builds one.'} />
        : templates.map((template) => (
          <SessionRow
            key={template.id}
            id={template.id}
            name={template.name}
            meta={templateMeta(template, servers)}
            playersLabel={playersLabel(template.players.length)}
            busy={isBusy(template.id)}
            onEdit={onEdit}
            onRun={onRun}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        ))}
    </Stack>
  </Card>
);

export { SessionsCard };
