/* @layer renderer-app @kind component */
import { Card, EmptyState, SectionHeader, Stack } from '@drizztdourden08/tessera/primitives';
import type { TemplatesCardProps } from './TemplatesCard.type';
import { TemplateRow } from '@archipelia/design';
import { templateMeta } from '../../behavior/template-meta';
import { playersLabel } from '../../behavior/players-label';

const TemplatesCard = ({ templates, total, servers, isBusy, onEdit, onRun, onDuplicate, onDelete }: TemplatesCardProps) => (
  <Card>
    <Stack gap="sm">
      <SectionHeader title={`Templates · ${total}`} />
      {templates.length === 0
        ? <EmptyState message={total ? 'No template matches' : 'No template yet. New session starts one.'} />
        : templates.map((template) => (
          <TemplateRow
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

export { TemplatesCard };
