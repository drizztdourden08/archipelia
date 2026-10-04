/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { useSearchEntries } from '@drizztdourden08/brock-react';
import { sessionEditorRoute } from '../../../../hooks/session-editor-route';
import { templateMeta } from '../../behavior/template-meta';
import type { TemplateSearchEntryProps } from './TemplateSearchEntry.type';

const TemplateSearchEntry = ({ template, servers }: TemplateSearchEntryProps) => {
  const entries = useMemo(() => [{
    id: template.id,
    label: template.name,
    description: templateMeta(template, servers),
    keywords: ['session', 'saved session', 'edit', ...template.players.map((player) => player.game)],
  }], [template, servers]);
  useSearchEntries(entries, sessionEditorRoute(template.id));
  return null;
};

export { TemplateSearchEntry };
