/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useSearchEntries } from '@drizztdourden08/brock-react';
import type { ServerEntry, SessionTemplate } from '@archipelia/model';
import { templateAnchor } from './template-anchor';
import { templateMeta } from './template-meta';

const useTemplateEntries = (templates: readonly SessionTemplate[], servers: ServerEntry[]): void => {
  const entries = useMemo(() => templates.map((template) => ({
    label: template.name,
    description: templateMeta(template, servers),
    keywords: ['template', 'session', ...template.players.map((player) => player.game)],
    anchor: templateAnchor(template.id),
  })), [templates, servers]);
  useSearchEntries(entries);
};

export { useTemplateEntries };
